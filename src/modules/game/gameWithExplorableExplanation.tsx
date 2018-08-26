import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContentKey, ExplorableExplanation } from '../explorableExplanation/explorableExplanation';
import { Game, IGameProps, IGameState } from '../game/game';
import { Stage, StageKey } from '../stage/stage';

interface IGameWithExplorableExplanationProps extends IGameProps {}

interface IGameWithExplorableExplanationState extends IGameState {
  contentId: ContentKey;
}

export class GameWithExplorableExplanation extends Game<IGameWithExplorableExplanationProps, IGameWithExplorableExplanationState> {
  constructor(props: IGameWithExplorableExplanationProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className="gameWithExplorableExplanation">
        {
          ReactDOM.createPortal(
            <Stage stageId={ this.state.area } />,
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
    );
  }

  protected initGame(): void {
    super.initGame();

    this.state = {
      area: 'a000',
      contentId: 'content1',
      keycodes: {},
    }
  }
}