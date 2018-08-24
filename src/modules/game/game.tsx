import * as a000 from '../stage/json/a000.json';
import * as React from 'react';
import { Stage } from '../stage/stage';

export interface IGameProps {}

export interface IGameState {
    area: any;
}

export class Game<P extends IGameProps, S extends IGameState> extends React.Component<P, S> {
    public state: S;

    private gameLoopInterval;

    constructor(props: P) {
        super(props);

        /**
         * TODO: Fix this typing.
         * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14250#issuecomment-275253262
         */
        (this.state as S as Readonly<IGameState>) = {
            area: a000,
        };

        this.initGame();
    }

    protected initGame(): void {
        this.initGameLoop();
    }

    public render(): JSX.Element {
        return <Stage data={ this.state.area }></Stage>;
    }

    private initGameLoop(): void {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }

        this.gameLoopInterval = setInterval(
            () => {
                // Do stuff...
            },
            1000 / 60
        );
    }
}
