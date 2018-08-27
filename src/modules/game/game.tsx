import * as React from 'react';
import update from 'immutability-helper';
import { Stage, StageId } from '../stage/stage';
import { ContentId } from '../explorableExplanation/explorableExplanation';

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
  contentId: ContentId;
  keycodes: Keycodes;
  stageId: StageId;
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
      contentId: 'c000',
      stageId: 'a000',
      keycodes: {},
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

  private initGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }

    this.gameLoopInterval = setInterval(
      () => {
        // Do stuff...?
      },
      1000 / 60
    );
  }

  // TODO: Debounce this...?
  private keydown(event: KeyboardEvent): void {
    const newState = {
      keycodes: update(this.state.keycodes, { [event.keyCode]: { $set: true } })
    };

    this.setState(() => newState);
  }

  // TODO: Debounce this...?
  private keyup(event: KeyboardEvent): void {
    const newState = {
      keycodes: update(this.state.keycodes, { [event.keyCode]: { $set: false } })
    };

    this.setState(() => newState);
  }

  private loadStage(event: CustomEvent): void {
    const { contentId, stageId } = event.detail;
    const newState = {
      contentId,
      stageId,
    };

    this.setState(() => newState);
  }
}
