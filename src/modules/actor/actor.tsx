import * as React from 'react';
import update from 'immutability-helper';
import { BaseObjectComponent, IBaseObjectProps } from '../baseObject/baseObject';
import { IGameState, Key } from '../game/game';
import { CollisionMap, IStageState, PortalMap, StageId } from '../stage/stage';

enum ActorState {
  Idle = 'Idle',
  Interacting = 'Interacting',
  Moving = 'Moving',
}

type Position = {
  x: number;
  y: number;
}

interface IActorProps extends IBaseObjectProps {
  collisionMap?: CollisionMap;
  portalMap?: PortalMap;
  gameState?: IGameState;
}

interface IActorState {
  actorState: ActorState;
  position: Position;
}

export class Actor extends React.Component<IActorProps, IActorState> {
  public props: IActorProps;
  public state: IActorState;

  private actorStateTimeout: number;

  constructor(props: IActorProps) {
    super(props);

    const { x, y } = props;

    this.state = {
      actorState: ActorState.Idle,
      position: { x, y },
    };
  }

  public componentDidUpdate(prevProps: IActorProps, prevState: IActorState): void {
    if (this.state.actorState === ActorState.Moving && !this.actorStateTimeout) {
      this.actorStateTimeout = window.setTimeout(
        () => {
          const newState = { actorState: ActorState.Idle };

          this.actorStateTimeout = null;

          this.setState(() => newState);
        },
        200
      );
    }
  }

  public static getDerivedStateFromProps(props: IActorProps, state: IActorState): IActorState {
    console.log('derived', state.actorState);
    const { collisionMap, gameState, portalMap } = props;
    let { x, y } = state.position;
    let newState = { ...state };

    // TODO: Set the player's direction.
    if (gameState.keycodes[Key.Down]) {
      y += 32;
    }

    if (gameState.keycodes[Key.Left]) {
      x -= 32;
    }

    if (gameState.keycodes[Key.Right]) {
      x += 32;
    }

    if (gameState.keycodes[Key.Up]) {
      y -= 32;
    }

    // if (gameState.keycodes[Key.Enter]) {
    // }

    const positionWillChange = x !== state.position.x || y !== state.position.y;

    if (positionWillChange) {
      // TODO: This "- 1" can't be right...
      const positionKey = `${ (y / 32) - 1 }-${ x / 32 }`;

      if (newState.actorState !== ActorState.Moving && !collisionMap[positionKey]) {
        newState = {
          actorState: ActorState.Moving,
          position: { x, y },
        }
      }

      if (portalMap[positionKey]) {
        const { contentId, stageId } = portalMap[positionKey];
        const detail = { contentId, stageId };

        document.dispatchEvent(new CustomEvent('loadStage', { detail }));
      }

      return newState;
    }
  }

  public render(): JSX.Element {
    const { gid, id, height, name, properties, type, width, visible } = this.props;

    return (
      <BaseObjectComponent
        gid = { gid }
        id = { id }
        height = { height }
        name = { name }
        { ...this.state.position }
        properties = { properties }
        type = { type }
        width = { width }
        visible = { visible }
      >
        { name }
      </BaseObjectComponent>
    );
  }
}
