import * as React from 'react';
import { ContentId } from '../explorableExplanation/explorableExplanation';
import { StageId } from '../stage/stage';

export enum ObjectType {
  Flavor = 'flavor',
  NPC = 'npc',
  Player = 'player',
  Portal = 'portal',
};
export interface IBaseObjectProps extends Partial<BaseObject> {
  children?: any;
  column: number;
  id: number;
  height: number;
  name: string;
  properties: ObjectProperties;
  row: number;
  type: ObjectType;
  width: number;
  visible: boolean;
}

export type BaseObject = {
  // TODO: Do I need this?
  gid: number;
  id: number;
  height: number;
  name: string;
  properties: ObjectProperties;
  type: ObjectType;
  width: number;
  visible: boolean;
  x: number;
  y: number;
}

type ObjectProperties = {
  contentId: ContentId;
  prevStageId: StageId;
  stageId: StageId;
}

const BaseObjectComponent: React.SFC<IBaseObjectProps> =
  ({ children, height, id, type, visible, width, column, row }: IBaseObjectProps): JSX.Element => {
    return (
      <div
        className={ `${ type } ${ type }--${ id }` }
        style={
          {
            height: `${ height }px`,
            left: `${ column * width }px`,
            top: `${ row * height }px`,
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
