import * as React from 'react';
import update from 'immutability-helper';
import { BaseObjectComponent, IBaseObjectProps } from '../baseObject/baseObject';
import { IGameState, Key } from '../game/game';

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
  gameState?: IGameState
}

interface IActorState {
  actorState: ActorState;
  position: Position;
}

export class Actor extends React.Component<IActorProps, IActorState> {
  public props: IActorProps;
  public state: IActorState;

  constructor(props: IActorProps) {
    super(props);

    this.state = {
      actorState: ActorState.Idle,
      position: {
        x: props.x,
        y: props.y,
      }
    };
  }

  public componentDidUpdate(prevProps: IActorProps, prevState: IActorState): void {
    // let { x, y } = this.props;

    // if (this.props.gameState) {
    //   if (this.props.gameState.keycodes[Key.Down]) {
    //     y += 32;
    //   }
  
    //   if (this.props.gameState.keycodes[Key.Left]) {
    //     x -= 32;
    //   }
  
    //   if (this.props.gameState.keycodes[Key.Right]) {
    //     x += 32;
    //   }
  
    //   if (this.props.gameState.keycodes[Key.Up]) {
    //     y -= 32;
    //   }
    // }

    // if (prevProps.x !== x) {
    //   const xState = {
    //     position: update(this.state.position, { x: { $set: x } })
    //   };

    //   this.setState(() => xState);
    // }

    // if (prevProps.y !== y) {
    //   const yState = {
    //     position: update(this.state.position, { y: { $set: y } })
    //   };

    //   this.setState(() => yState);
    // }

    console.log(this.props);
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
