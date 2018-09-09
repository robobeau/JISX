import * as React from 'react';
import * as PropTypes from 'prop-types';

interface ITileProps {
  column: number;
  row: number;
  height: number;
  id: number;
  width: number;
  tileset: any;
}

const Tile: React.SFC<ITileProps> =
  ({ column, height, id, row, width, tileset }: ITileProps) => {
    const bgPositionRow = Math.floor(id / tileset.columns);
    const bgPositionColumn = id - (bgPositionRow * tileset.columns);
    const bgPositionX = bgPositionColumn * width;
    const bgPositionY = bgPositionRow * height;

    return (
      <div
        className={ `tile tile--${ id }` }
        style={
          {
            backgroundPosition: `-${ bgPositionX }px -${ bgPositionY }px`,
            left: `${ column * width }px`,
            height: `${ height }px`,
            top: `${ row * height }px`,
            width: `${ width }px`,
          }
        }
      ></div>
    );
  };

Tile.propTypes = {
  column: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  tileset: PropTypes.any.isRequired,
}

export { Tile };