import * as React from 'react';
import update from 'immutability-helper';
import { Stage, StageKey } from '../stage/stage';

export enum Key {
  Down = 40,
  Left = 37,
  Right = 39,
  Up = 38,
}

type Keycodes = { [key: number]: boolean };

export const GameContext = React.createContext<IGameState>(null);

export interface IGameProps {}

export interface IGameState {
  keycodes: Keycodes;
  area: StageKey;
}

export class Game<P extends IGameProps, S extends IGameState> extends React.Component<P, S> {
  public state: S;

  private gameLoopInterval;

  constructor(props: P) {
    super(props);

    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);

    /**
     * TODO: Fix this typing.
     * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14250#issuecomment-275253262
     */
    (this.state as S as Readonly<IGameState>) = {
      area: 'a000',
      keycodes: {},
    };

    this.initGame();
  }

  public componentDidMount(): void {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  }

  public componentDidUpdate(): void {
    console.log('update!', this.state);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  }

  public render(): JSX.Element {
    return (
      <GameContext.Provider value={ this.state }>
        <Stage stageId={ this.state.area }></Stage>
      </GameContext.Provider>
    );
  }

  protected initGame(): void {
    this.initGameLoop();
  }

  private initGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }

    this.gameLoopInterval = setInterval(
      () => {
        // console.log(this.state.keycodes);
      },
      1000 / 60
    );
  }

  private keydown(event: KeyboardEvent): void {
    const state = {
      keycodes: update(this.state.keycodes, { [event.keyCode]: { $set: true } })
    };
    
    this.setState(() => state);
  }

  private keyup(event: KeyboardEvent): void {
    const state = {
      keycodes: update(this.state.keycodes, { [event.keyCode]: { $set: false } })
    };
    
    this.setState(() => state);
  }
}
