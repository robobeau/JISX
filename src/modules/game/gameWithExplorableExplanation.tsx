import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContentId, ExplorableExplanation } from '../explorableExplanation/explorableExplanation';
import { Game, GameContext, IGameProps, IGameState } from '../game/game';
import { Stage, StageId } from '../stage/stage';

interface IGameWithExplorableExplanationProps extends IGameProps {}

interface IGameWithExplorableExplanationState extends IGameState {
  contentId: ContentId;
}

export class GameWithExplorableExplanation extends Game<IGameWithExplorableExplanationProps, IGameWithExplorableExplanationState> {
  constructor(props: IGameWithExplorableExplanationProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <GameContext.Provider value={ this.state }>
        <div className="gameWithExplorableExplanation">
          {
            ReactDOM.createPortal(
              <Stage stageId={ this.state.stageId } />,
              document.getElementById('stagePlaceholder')
            )
          }
          {
            ReactDOM.createPortal(
              <ExplorableExplanation contentId={ this.state.contentId } />,
              document.getElementById('contentPlaceholder')
            )
          }
        </div>
      </GameContext.Provider>
    );
  }

  protected initGame(): void {
    super.initGame();

    this.state = {
      contentId: ContentId.c000,
      keycodes: {},
      stageId: StageId.A000,
      ticks: 0,
    }
  }

  protected loadStage(event: CustomEvent): void {
    super.loadStage(event);

    const { contentId } = event.detail;

    this.setState(() => ({ contentId }));
  }
}