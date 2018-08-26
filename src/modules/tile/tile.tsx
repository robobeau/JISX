import * as React from 'react';
import * as PropTypes from 'prop-types';

interface ITileProps {
  column: number;
  row: number;
  tileHeight: number;
  tileId: number;
  tileWidth: number;
  tileset: any;
}

const Tile: React.SFC<ITileProps> =
  ({ column, row, tileHeight, tileId, tileWidth, tileset }: ITileProps) => {
    const bgPositionRow = Math.floor(tileId / tileset.columns);
    const bgPositionColumn = tileId - (bgPositionRow * tileset.columns);
    const bgPositionX = bgPositionColumn * tileWidth;
    const bgPositionY = bgPositionRow * tileHeight;

    return (
      <div
        className={ `tile tile--${ tileId }` }
        style={
          {
            backgroundPosition: `-${ bgPositionX }px -${ bgPositionY }px`,
            left: `${ column * tileWidth }px`,
            height: `${ tileHeight }px`,
            top: `${ row * tileHeight }px`,
            width: `${ tileWidth }px`,
          }
        }
      ></div>
    );
  };

Tile.propTypes = {
  column: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  tileHeight: PropTypes.number.isRequired,
  tileId: PropTypes.number.isRequired,
  tileWidth: PropTypes.number.isRequired,
  tileset: PropTypes.any.isRequired,
}

export { Tile };