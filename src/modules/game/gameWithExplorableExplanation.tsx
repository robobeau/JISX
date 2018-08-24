import * as a000 from '../stage/json/a000.json';
// import * as a001 from '../stage/json/a001.json';
// import * as a002 from '../stage/json/a002.json';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Game, IGameProps, IGameState } from '../game/game';
import { Stage } from '../stage/stage';
import { ExplorableExplanation } from '../explorableExplanation/explorableExplanation';

interface IGameWithExplorableExplanationProps extends IGameProps {}

interface IGameWithExplorableExplanationState extends IGameState {
    contentId: number;
}

export class GameWithExplorableExplanation extends Game<IGameWithExplorableExplanationProps, IGameWithExplorableExplanationState> {
    constructor(props: IGameWithExplorableExplanationProps) {
        super(props);
    }

    protected initGame(): void {
        super.initGame();

        this.state = {
            area: a000,
            contentId: 1,
        }

        // this.initScrollListener();
    }

    public render(): JSX.Element {
        return (
            <div className="gameWithExplorableExplanation">
                {
                    ReactDOM.createPortal(
                        <Stage data={ this.state.area } />,
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

    // private initScrollListener(): void {
    //     const step2 = document.getElementById('step2');
    //     const step3 = document.getElementById('step3');

    //     document.addEventListener('scroll', (event: Event) => {
    //         let area = a000;

    //         if (window.pageYOffset > step2.offsetTop) {
    //             area = a001;
    //         }

    //         if (window.pageYOffset > step3.offsetTop) {
    //             area = a002;
    //         }

    //         if (area !== this.state.area) {
    //             console.time("rendering");
    //             this.setState((prevState, props) => {
    //                 return { area };
    //             });
    //             console.timeEnd("rendering");
    //         }
    //     });
    // }
}