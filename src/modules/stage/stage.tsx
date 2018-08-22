import * as React from 'react';

export interface IStageData {
    height: number;
    layers: IStageDataLayer[];
    properties: IStageDataProperties;
    tilesets: IStageDataTileset[];
    tileheight: number;
    tilewidth: number;
    width: number;
}

interface IStageDataLayer {
    data: number[];
    height: number;
    opacity: number;
    visible: boolean;
    width: number;
}

interface IStageDataProperties {
    music: string;
    musicVol: string;
}

interface IStageDataTileset {
    columns: number;
}

interface IStageProps {
    data: IStageData;
}

interface IStageState {}

export class Stage extends React.Component<IStageProps, IStageState> {
    public props: IStageProps;
    public state: IStageState;

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
                        height: `${ this.props.data.height * this.props.data.tileheight }px`,
                        // height: '1000px',
                        width: `${ this.props.data.width * this.props.data.tilewidth }px`,
                        // width: '1000px',
                    }
                }
            >
                { this.generateStage() }
            </div>
        );
    }

    private generateStage(): JSX.Element[] {
        return this.props.data.layers.map(
            (layer: IStageDataLayer, index: number) => {
                if (layer.data) {
                    return this.generateStageLayer(layer, index);
                }
            }
        );
    }

    private generateStageLayer(layer: IStageDataLayer, layerIndex: number): JSX.Element {
        const tiles = layer.data.map(
            (tile: number, tileIndex: number) => {
                const row = Math.floor(tileIndex / layer.width);
                const column = tileIndex - (row * layer.width);

                return this.generateStageLayerTile(tile, column, row);
            }
        );

        return (
            <div
                className="stage_layer"
                style={
                    {
                        opacity: layer.opacity,
                        visibility: layer.visible ? 'visible' : 'hidden',
                        zIndex: layerIndex,
                    }
                }
            >
                { tiles }
            </div>
        );
    }

    private generateStageLayerTile(tile: number, column: number, row: number): JSX.Element {
        // I need to adjust the tile ID by 1, because 0 stands for empty.
        const adjustedTile = tile - 1;
        // TODO: I don't like that I'm directly accessing the first tileset, like this...
        const tileset = this.props.data.tilesets[0];
        const tileHeight = this.props.data.tileheight;
        const tileWidth = this.props.data.tilewidth;
        const backgroundPositionRow = Math.floor(adjustedTile / tileset.columns);
        const backgroundPositionColumn = adjustedTile - (backgroundPositionRow * tileset.columns);
        const backgroundPositionX = backgroundPositionColumn * tileWidth;
        const backgroundPositionY = backgroundPositionRow * tileHeight;

        return (
            <div
                className={ `stage_tile stage_tile--${ tile }` }
                style={
                    {
                        backgroundPosition: `-${ backgroundPositionX }px -${ backgroundPositionY }px`,
                        display: tile === 0 ? 'none' : 'block',
                        left: `${ column * tileWidth }px`,
                        height: `${ tileHeight }px`,
                        top: `${ row * tileHeight }px`,
                        width: `${ tileWidth }px`,
                    }
                }
            ></div>
        );
    }
}
