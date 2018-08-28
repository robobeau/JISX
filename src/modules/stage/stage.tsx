import * as React from 'react';
import { Actor } from '../actor/actor';
import { IBaseObjectProps } from '../baseObject/baseObject';
import { ContentId } from '../explorableExplanation/explorableExplanation';
import { FlavorText } from '../flavorText/flavorText';
import { Portal } from '../portal/portal';
import { GameContext } from '../game/game';
import { Tile } from '../tile/tile';

export const StageContext = React.createContext<StageContext>(null);

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

export type CollisionMap = {
  [key: string]: boolean;
}

export type PortalMap = {
  [key: string]: {
    contentId: ContentId;
    stageId: StageId;
  };
}

export type StageId = 'a000' | 'a001' | 'a002' | 'a003' | 'a004';

type BaseLayer = {
  height: number;
  name: string;
  opacity: number;
  type: LayerType;
  width: number;
  visible: boolean;
}

type BaseObjectLayer = {
  objects: IBaseObjectProps[];
}

type BaseTilesLayer = {
  data: number[];
}

type Layer = ObjectsLayer | TilesLayer;

type LayerType = 'tilelayer' | 'objectgroup';

type ObjectsLayer = BaseObjectLayer & BaseLayer;

type Properties = {
  music: string;
  musicVol: string;
}

type StageContext = {
  collisionMap: CollisionMap;
  portalMap: PortalMap;
}

type StageData = {
  height: number;
  layers: Layer[];
  properties: Properties;
  tilesets: Tileset[];
  tileheight: number;
  tilewidth: number;
  width: number;
}

type TilesLayer = BaseTilesLayer & BaseLayer;

type Tileset = {
  columns: number;
}

export interface IStageState {
  // prevStageId: StageId;
}

interface IStageProps {
  stageId: Readonly<StageId>;
}

export class Stage extends React.Component<IStageProps, IStageState> {
  public props: IStageProps;
  public state: IStageState;

  private layers: JSX.Element[];

  private collisionMap: CollisionMap = {};
  private portalMap: PortalMap = {};
  private prevStageId: StageId;

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
      // prevStageId: props.stageId,
    };

    this.prevStageId = props.stageId;
    this.layers = this.generateStage();
  }

  public componentDidUpdate(prevProps: IStageProps, prevState: IStageState): void {
    if (this.props.stageId !== prevProps.stageId) {
      this.prevStageId = prevProps.stageId;
      this.layers = this.generateStage();
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
          { this.layers }
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

  private generateObject(object: IBaseObjectProps): JSX.Element {
    const { height, id, name, properties, type, visible, width, x, y } = object;

    switch (type) {
      case 'flavor':
        return <FlavorText { ...object } />;
      case 'npc':
        return <Actor { ...object } />;
      case 'player':
        if (properties.prevStageId !== this.prevStageId) {
          return;
        }

        return (
          <GameContext.Consumer>
            { gameState => (
              // <StageContext.Consumer>
              //   { stageState => (
                  <Actor
                    { ...object }
                    collisionMap={ this.collisionMap }
                    gameState={ gameState }
                    portalMap={ this.portalMap }
                  />
              //   )}
              // </StageContext.Consumer>
            )}
          </GameContext.Consumer>
        );
      case 'portal':
          return <Portal { ...object } />;
      default:
        return (
          <div
            className={ `object object--${ id }` }
            style={
              {
                left: `${ x }px`,
                height: `${ height }px`,
                // TODO: This can't be right...
                top: `${ y - height }px`,
                width: `${ width }px`,
                visibility: visible ? 'visible' : 'hidden',
              }
            }
          >
            { name }
          </div>
        )
    }
  }

  private generateObjectsLayer(layer: ObjectsLayer, layerIndex: number): JSX.Element {
    let portalMap = {};

    const objects = layer.objects.map(
      (object: IBaseObjectProps, objectIndex: number) => {
        if (object.type === 'portal') {
          const { x, y, properties } = object;
          const { contentId, stageId } = properties;
          const positionKey = `${ (y / 32) - 1 }-${ x / 32 }`;

          portalMap[positionKey] = {
            contentId,
            stageId,
          };
        }

        return this.generateObject(object);
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

        // -1 (or 0 before adjusting) stands for empty, so don't render empty tiles.
        if (adjustedTileId === -1) {
          return;
        }

        if (adjustedTileId === 1) {
          collisionMap[`${ row }-${ column }`] = true;
        }

        return (
          <Tile
            column={ column }
            row={ row }
            tileHeight={ this.tileHeight }
            tileId={ adjustedTileId }
            tileWidth={ this.tileWidth }
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
    return (layer as ObjectsLayer).type === 'objectgroup';
  }

  private isTilesLayer(layer: any): layer is TilesLayer {
    return (layer as TilesLayer).type === 'tilelayer';
  }
}
