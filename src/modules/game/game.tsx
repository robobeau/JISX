import * as a000 from '../stage/json/a000.json';
import * as a001 from '../stage/json/a001.json';
import * as a002 from '../stage/json/a002.json';
import * as React from 'react';
import { Stage } from '../stage/stage';

interface IGameState {
    area: any;
}

interface IGameProps {

}

const areas: any[] = [
    a000,
    a001,
    a002,
];

export class Game extends React.Component<IGameProps, IGameState> {
    private gameLoopInterval;

    constructor(props) {
        super(props);

        this.state = {
            area: a000,
        };

        this.initGame();
    }

    public render(): JSX.Element {
        return (
            <Stage data={ this.state.area }></Stage>
        );
    }

    private initGame(): void {
        // this.initGameLoop();
        this.initScrollListener();
    }

    private initGameLoop(): void {
        let counter = 0;

        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }

        this.gameLoopInterval = setInterval(
            () => {
                console.time("rendering");
                this.setState((prevState, props) => {
                    return {
                        area: areas[counter],
                    }
                });
                console.timeEnd("rendering");

                counter = counter < 2 ? counter + 1 : 0;
            },
            500
        );
    }

    private initScrollListener(): void {
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');

        document.addEventListener('scroll', (event: Event) => {
            let area = a000;

            if (window.pageYOffset > step2.offsetTop) {
                area = a001;
            }

            if (window.pageYOffset > step3.offsetTop) {
                area = a002;
            }

            if (area !== this.state.area) {
                console.time("rendering");
                this.setState((prevState, props) => {
                    return { area }
                });
                console.timeEnd("rendering");
            }
        });
    }
}
