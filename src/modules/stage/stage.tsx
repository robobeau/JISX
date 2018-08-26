import * as React from 'react';
import { Actor } from '../actor/actor';
import { IBaseObjectProps } from '../baseObject/baseObject';
import { FlavorText } from '../flavorText/flavorText';
import { Portal } from '../portal/portal';
import { Tile } from '../tile/tile';
import { GameContext } from '../game/game'

const a000 = require('../stage/json/a000.json');
const a001 = require('../stage/json/a001.json');
const a002 = require('../stage/json/a002.json');
const stages: { [key in StageKey]: StageData } = {
  a000,
  a001,
  a002,
}

type BaseLayer = {
  height: number;
  name: string;
  opacity: number;
  type: string;
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

type ObjectsLayer = BaseObjectLayer & BaseLayer;

type Properties = {
  music: string;
  musicVol: string;
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

export type StageKey = 'a000' | 'a001' | 'a002';

type TilesLayer = BaseTilesLayer & BaseLayer;

type Tileset = {
  columns: number;
}

interface IStageProps {
  stageId: Readonly<StageKey>;
}

interface IStageState {}

export class Stage extends React.Component<IStageProps, IStageState> {
  public props: IStageProps;
  public state: IStageState;

  private stage: StageData;

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

    this.stage = stages[this.props.stageId];
    this.state = {};
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.stageId) {
      this.stage = stages[this.props.stageId];
    }
  }

  public render(): JSX.Element {
    return (
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
    const { height, id, name, type, visible, width, x, y } = object;

    switch (type) {
      case 'flavor':
        return <FlavorText { ...object } />;
      case 'npc':
        return <Actor { ...object } />;
      case 'player':
        // TODO: Logic for whether or not to render Player, depending on spawn location.

        return (
          <GameContext.Consumer>
            { gameState => <Actor { ...object } gameState={ gameState } /> }
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
    const objects = layer.objects.map(
      (object: IBaseObjectProps, objectIndex: number) => {
        return this.generateObject(object);
      }
    );

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
    const tiles = layer.data.map(
      (tile: number, tileIndex: number) => {
        const row = Math.floor(tileIndex / layer.width);
        const column = tileIndex - (row * layer.width);

        // 0 stands for empty, so don't render empty tiles.
        if (tile === 0) {
          return;
        }
        
        return (
          <Tile
            column={ column }
            row={ row }
            tileHeight={ this.tileHeight }
            // I need to adjust "tileId" by 1, because 0 stands for empty.
            tileId={ tile - 1 }
            tileWidth={ this.tileWidth }
            tileset={ this.tileset }
          />
        );
      }
    );

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
