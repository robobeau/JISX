import * as React from 'react';
import { Actor } from '../actor/actor';

export type ObjectType = 'flavor' | 'npc' | 'player' | 'stairs';

export type Object = {
    gid: number; // TODO: Do I need this?
    id: number;
    height: number;
    name: string;
    properties: any; // TODO: Type this.
    type: ObjectType;
    width: number;
    visible: boolean;
    x: number;
    y: number;
}

type BaseLayer = {
    opacity: number;
    height: number;
    type: string;
    width: number;
    visible: boolean;
}

type BaseObjectLayer = {
    objects: Object[];
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

type TilesLayer = BaseTilesLayer & BaseLayer;

type Tileset = {
    columns: number;
}

interface IStageProps {
    data: Readonly<StageData>;
}

interface IStageState {}

export class Stage extends React.Component<IStageProps, IStageState> {
    public props: IStageProps;
    public state: IStageState;

    private get stageHeight(): number {
        return this.props.data.height;
    }

    private get stageWidth(): number {
        return this.props.data.width;
    }

    private get tileHeight(): number {
        return this.props.data.tileheight;
    }

    private get tileWidth(): number {
        return this.props.data.tilewidth;
    }

    private get tileset(): any {
        // TODO: I don't like that I'm directly accessing the first tileset, like this...
        return this.props.data.tilesets[0];
    }

    constructor(props: IStageProps) {
        super(props);

        this.state = {};
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
        return this.props.data.layers.map(
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

    private generateObject(object: Object): JSX.Element {
        const { height, id, name, type, visible, width, x, y } = object;

        switch (type) {
            // case 'flavor':
            //     return;
            // case 'npc':
            //     return;
            case 'player':
                return <Actor data={ object } />;
            // case 'stairs':
            //     return;
            default:
                return (
                    <div
                        className={ `object object--${ name } object--${ id }` }
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
            (object: Object, objectIndex: number) => {
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

    private generateTile(tile: number, column: number, row: number): JSX.Element {
        // I need to adjust the tile ID by 1, because 0 stands for empty.
        const adjustedTile = tile - 1;
        const backgroundPositionRow = Math.floor(adjustedTile / this.tileset.columns);
        const backgroundPositionColumn = adjustedTile - (backgroundPositionRow * this.tileset.columns);
        const backgroundPositionX = backgroundPositionColumn * this.tileWidth;
        const backgroundPositionY = backgroundPositionRow * this.tileHeight;

        // 0 stands for empty, so don't render empty tiles.
        if (tile === 0) {
            return;
        }

        return (
            <div
                className={ `tile tile--${ tile }` }
                style={
                    {
                        backgroundPosition: `-${ backgroundPositionX }px -${ backgroundPositionY }px`,
                        left: `${ column * this.tileWidth }px`,
                        height: `${ this.tileHeight }px`,
                        top: `${ row * this.tileHeight }px`,
                        width: `${ this.tileWidth }px`,
                    }
                }
            ></div>
        );
    }

    private generateTilesLayer(layer: TilesLayer, layerIndex: number): JSX.Element {
        const tiles = layer.data.map(
            (tile: number, tileIndex: number) => {
                const row = Math.floor(tileIndex / layer.width);
                const column = tileIndex - (row * layer.width);

                return this.generateTile(tile, column, row);
            }
        );

        return (
            <div
                className="tilesLayer"
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
