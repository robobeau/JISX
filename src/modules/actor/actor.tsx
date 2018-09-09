import * as React from 'react';
import { BaseObjectComponent, IBaseObjectProps } from '../baseObject/baseObject';
import { IGameState, Keycode, Keycodes, Position } from '../game/game';
import { CollisionMap, PortalMap } from '../stage/stage';

const ACTOR_MOVEMENT_TICKS = 12;

enum ActorState {
  Idle = 'Idle',
  Interacting = 'Interacting',
  Moving = 'Moving',
}

interface IActorProps extends IBaseObjectProps {
  collisionMap?: CollisionMap;
  portalMap?: PortalMap;
  gameState?: IGameState;
}

interface IActorState {
  actorState: ActorState;
  movementTicks: number;
  position: Position;
  ticks: number;
}

function getFuturePosition(keycodes: Keycodes, { column, row }: Position): Position {
  if (keycodes[Keycode.Down]) {
    row += 1;
  }

  if (keycodes[Keycode.Left]) {
    column -= 1;
  }

  if (keycodes[Keycode.Right]) {
    column += 1;
  }

  if (keycodes[Keycode.Up]) {
    row -= 1;
  }

  return { column, row };
}

export class Actor extends React.Component<IActorProps, IActorState> {
  public props: IActorProps;
  public state: IActorState;

  constructor(props: IActorProps) {
    super(props);

    const { column, row } = props;

    this.state = {
      actorState: ActorState.Idle,
      movementTicks: 0,
      position: { column, row },
      ticks: 0,
    };
  }

  public static getDerivedStateFromProps(nextProps: IActorProps, prevState: IActorState): IActorState {
    const { collisionMap, gameState: { keycodes, ticks }, portalMap } = nextProps;
    let newState = { ...prevState };

    newState.actorState = ActorState.Idle;

    if (ticks !== prevState.ticks) {
      newState.movementTicks += 1;
    }

    const canMove = newState.movementTicks >= ACTOR_MOVEMENT_TICKS;

    // if (keycodes[Key.Enter]) {
    // }

    if (canMove) {
      const futurePosition = getFuturePosition(keycodes, prevState.position);
      const positionWillChange = (
        futurePosition.column !== prevState.position.column
        || futurePosition.row !== prevState.position.row
      );

      if (positionWillChange) {
        const positionKey = `${ futurePosition.row }-${ futurePosition.column }`;

        if (!collisionMap[positionKey]) {
          newState.actorState = ActorState.Moving;
          newState.position = futurePosition;
          newState.movementTicks = 0;
        }

        if (portalMap[positionKey]) {
          const { contentId, stageId } = portalMap[positionKey];
          const detail = { contentId, stageId };

          document.dispatchEvent(new CustomEvent('loadStage', { detail }));
        }
      }
    }

    newState.ticks += 1;

    return newState;
  }

  public render(): JSX.Element {
    const { gid, id, height, name, properties, type, width, visible } = this.props;
    const { column, row } = this.state.position;

    return (
      <BaseObjectComponent
        column={ column }
        gid={ gid }
        id={ id }
        height={ height }
        name={ name }
        properties={ properties }
        row={ row }
        type={ type }
        width={ width }
        visible={ visible }
      >
      </BaseObjectComponent>
    );
  }
}
