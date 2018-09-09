import * as React from 'react';
import update from 'immutability-helper';
import { Stage, StageId } from '../stage/stage';

export const GameContext = React.createContext<IGameState>(null);

const FPS = 60;

export enum Keycode {
  Down = 40,
  Left = 37,
  Right = 39,
  Up = 38,
}

export interface IGameProps {}

export interface IGameState {
  keycodes: Keycodes;
  stageId: StageId;
  ticks: number;
}

export type Keycodes = { [key: number]: boolean };

export type Position = {
  column: number;
  row: number;
}

export class Game<P extends IGameProps, S extends IGameState> extends React.Component<P, S> {
  public state: S;

  private gameLoopInterval;

  constructor(props: P) {
    super(props);

    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    this.loadStage = this.loadStage.bind(this);

    /**
     * TODO: Fix this typing.
     * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14250#issuecomment-275253262
     */
    (this.state as S as Readonly<IGameState>) = {
      keycodes: {},
      stageId: StageId.A000,
      ticks: 0,
    };

    this.initGame();
  }

  public componentDidMount(): void {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    document.addEventListener('loadStage', this.loadStage);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
    document.removeEventListener('loadStage', this.loadStage);
  }

  public render(): JSX.Element {
    return (
      <GameContext.Provider value={ this.state }>
        <Stage stageId={ this.state.stageId }></Stage>
      </GameContext.Provider>
    );
  }

  protected initGame(): void {
    this.initGameLoop();
  }

  protected loadStage(event: CustomEvent): void {
    const { stageId } = event.detail;

    this.setState(() => ({ stageId }));
  }

  private initGameLoop(): void {
    clearInterval(this.gameLoopInterval);

    this.gameLoopInterval = setInterval(
      () => {
        this.setState(() => ({ ticks: this.state.ticks + 1 }));
      },
      1000 / FPS
    );
  }

  // TODO: Debounce this...?
  private keydown(event: KeyboardEvent): void {
    this.setState(() => (
      {
        keycodes: update(this.state.keycodes, { [event.keyCode]: { $set: true } })
      }
    ));
  }

  // TODO: Debounce this...?
  private keyup(event: KeyboardEvent): void {
    this.setState(() => (
      {
        keycodes: update(this.state.keycodes, { [event.keyCode]: { $set: false } })
      }
    ));
  }
}
