import * as React from 'react';
import { Actor } from '../actor/actor';
import { BaseObject, BaseObjectComponent, ObjectType } from '../baseObject/baseObject';
import { ContentId } from '../explorableExplanation/explorableExplanation';
import { FlavorText } from '../flavorText/flavorText';
import { GameContext, Position } from '../game/game';
import { Portal } from '../portal/portal';
import { Tile } from '../tile/tile';

export const StageContext = React.createContext<IStageContext>(null);

const a000 = require('../stage/json/a000.json');
const a001 = require('../stage/json/a001.json');
const a002 = require('../stage/json/a002.json');
const a003 = require('../stage/json/a003.json');
const a004 = require('../stage/json/a004.json');
const stages: { [key in StageId]: StageData } = {
  a000,
  a001,
  a002,
  a003,
  a004,
}

export enum StageId {
  A000 = 'a000',
  A001 = 'a001',
  A002 = 'a002',
  A003 = 'a003',
  A004 = 'a004',
}

export enum LayerType {
  TileLayer = 'tilelayer',
  ObjectGroup = 'objectgroup',
}

interface IStageState {
  prevStageId: StageId;
}

interface IStageProps {
  stageId: Readonly<StageId>;
}

interface IStageContext {
  collisionMap: CollisionMap;
  portalMap: PortalMap;
}

export type CollisionMap = {
  [key: string]: boolean;
}

export type PortalMap = {
  [key: string]: {
    contentId: ContentId;
    stageId: StageId;
  };
}

type BaseLayer = {
  height: number;
  name: string;
  opacity: number;
  type: LayerType;
  width: number;
  visible: boolean;
}

type Layer = ObjectsLayer | TilesLayer;

type ObjectsLayer = { objects: BaseObject[] } & BaseLayer;

type StageData = {
  height: number;
  layers: Layer[];
  properties: StageProperties;
  tilesets: Tileset[];
  tileheight: number;
  tilewidth: number;
  width: number;
}

type StageProperties = {
  music: string;
  musicVol: string;
}

type TilesLayer = { data: number[] } & BaseLayer;

type Tileset = {
  columns: number;
}

export class Stage extends React.Component<IStageProps, IStageState> {
  public props: IStageProps;
  public state: IStageState;

  private collisionMap: CollisionMap = {};
  private portalMap: PortalMap = {};

  private get stage(): StageData {
    return stages[this.props.stageId];
  }

  private get stageHeight(): number {
    return this.stage.height;
  }

  private get stageWidth(): number {
    return this.stage.width;
  }

  private get tileHeight(): number {
    return this.stage.tileheight;
  }

  private get tileWidth(): number {
    return this.stage.tilewidth;
  }

  private get tileset(): any {
    // TODO: I don't like that I'm directly accessing the first tileset, like this...
    return this.stage.tilesets[0];
  }

  constructor(props: IStageProps) {
    super(props);

    this.state = {
      prevStageId: props.stageId,
    };
  }

  public componentDidUpdate(prevProps: IStageProps, prevState: IStageState): void {
    if (this.props.stageId !== prevProps.stageId) {
      this.setState(() => ({ prevStageId: prevProps.stageId }));
    }
  }

  public render(): JSX.Element {
    const collisionMap = this.collisionMap;
    const portalMap = this.portalMap;

    return (
      <StageContext.Provider value={{ collisionMap, portalMap }}>
        <div
          id="stage"
          style={
            {
              height: `${ this.stageHeight * this.tileHeight }px`,
              width: `${ this.stageWidth * this.tileWidth }px`,
            }
          }
        >
          { this.generateStage() }
        </div>
      </StageContext.Provider>
    );
  }

  private generateStage(): JSX.Element[] {
    return this.stage.layers.map(
      (layer: Layer, index: number) => {
        if (this.isObjectsLayer(layer)) {
          return this.generateObjectsLayer(layer, index);
        }

        if (this.isTilesLayer(layer)) {
          return this.generateTilesLayer(layer, index);
        }
      }
    );
  }

  private generateObject(object: BaseObject, { column, row }: Position): JSX.Element {
    const { properties, type } = object;

    switch (type) {
      case ObjectType.Flavor:
        return <FlavorText { ...object } column={ column } row={ row } />;
      case ObjectType.NPC:
        return <Actor { ...object } column={ column } row={ row } />;
      case ObjectType.Player:
        if (properties.prevStageId !== this.state.prevStageId) {
          return;
        }

        return (
          <GameContext.Consumer>
            { gameState => (
              <StageContext.Consumer>
                { stageState => (
                  <Actor
                    { ...object }
                    column={ column }
                    collisionMap={ stageState.collisionMap }
                    gameState={ gameState }
                    portalMap={ stageState.portalMap }
                    row={ row }
                  />
                )}
              </StageContext.Consumer>
            )}
          </GameContext.Consumer>
        );
      case ObjectType.Portal:
        return <Portal { ...object } column={ column } row={ row } />;
      default:
        throw new Error(`Attempted to generate an unsupported object type: ${ type }`);
    }
  }

  private generateObjectsLayer(layer: ObjectsLayer, layerIndex: number): JSX.Element {
    let portalMap = {};

    const objects = layer.objects.map(
      (object: BaseObject, objectIndex: number) => {
        const { height, width, x, y } = object;
        const position: Position = {
          column: (x / width),
          row: (y / height) - 1, // Why the "- 1"...?
        }

        if (object.type === 'portal') {
          const { properties: { contentId, stageId } } = object;

          portalMap[`${ position.row }-${ position.column }`] = {
            contentId,
            stageId,
          };
        }

        return this.generateObject(object, position);
      }
    );

    if (layer.type === 'objectgroup') {
      this.portalMap = portalMap;
    }

    return (
      <div
        className="objectsLayer"
        style={
          {
            height: `${ this.stageHeight * this.tileHeight }px`,
            opacity: layer.opacity,
            visibility: layer.visible ? 'visible' : 'hidden',
            width: `${ this.stageWidth * this.tileWidth }px`,
            zIndex: layerIndex,
          }
        }
      >
        { objects }
      </div>
    );
  }

  private generateTilesLayer(layer: TilesLayer, layerIndex: number): JSX.Element {
    let collisionMap = {};

    const tiles = layer.data.map(
      (tile: number, tileIndex: number) => {
        // I need to adjust "tileId" by 1, because 0 stands for empty.
        const adjustedTileId = tile - 1;
        const row = Math.floor(tileIndex / layer.width);
        const column = tileIndex - (row * layer.width);

        // -1 (or 0, before adjusting) stands for empty, so don't render empty tiles.
        if (adjustedTileId === -1) {
          return;
        }

        // 1 (or 2, before adjusting) stands for a collision tile.
        if (adjustedTileId === 1) {
          collisionMap[`${ row }-${ column }`] = true;
        }

        return (
          <Tile
            column={ column }
            row={ row }
            height={ this.tileHeight }
            id={ adjustedTileId }
            width={ this.tileWidth }
            tileset={ this.tileset }
          />
        );
      }
    );

    if (layer.name === 'collisions') {
      this.collisionMap = collisionMap;
    }

    return (
      <div
        className={ `tilesLayer tilesLayer--${ layer.name }` }
        style={
          {
            height: `${ layer.height * this.tileHeight }px`,
            opacity: layer.opacity,
            visibility: layer.visible ? 'visible' : 'hidden',
            width: `${ layer.width * this.tileWidth }px`,
            zIndex: layerIndex,
          }
        }
      >
        { tiles }
      </div>
    );
  }

  private isObjectsLayer(layer: any): layer is ObjectsLayer {
    return (layer as ObjectsLayer).type === LayerType.ObjectGroup;
  }

  private isTilesLayer(layer: any): layer is TilesLayer {
    return (layer as TilesLayer).type === LayerType.TileLayer;
  }
}
