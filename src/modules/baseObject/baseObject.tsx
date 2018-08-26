import * as React from 'react';

export type ObjectType = 'flavor' | 'npc' | 'player' | 'portal';

export interface IBaseObjectProps {
  children?: any;
  // TODO: Do I need this?
  gid: number;
  id: number;
  height: number;
  name: string;
  // TODO: Type this.
  properties: any;
  type: ObjectType;
  width: number;
  visible: boolean;
  x: number;
  y: number;
}

const BaseObjectComponent: React.SFC<IBaseObjectProps> = 
  ({ children, height, id, type, visible, width, x, y }: IBaseObjectProps): JSX.Element => {    
    return (
      <div
        className={ `${ type } ${ type }--${ id }` }
        style={
          {
            height: `${ height }px`,
            left: `${ x }px`,
            // TODO: This can't be right...
            top: `${ y - height }px`,
            width: `${ width }px`,
            visibility: visible ? 'visible' : 'hidden',
          }
        }
      >
        { children }
      </div>
    );
  }

export { BaseObjectComponent }
