import * as React from 'react';

import { Object } from '../stage/stage';

enum ActorState {
    Idle = 'Idle',
    Interacting = 'Interacting',
    Moving = 'Moving',
}

type Position = {
    x: number;
    y: number;
}

interface IActorProps {
    data: Object;
}

interface IActorState {
    actorState: ActorState;
}

export class Actor extends React.Component<IActorProps, IActorState> {
    public props: IActorProps;
    public state: IActorState;

    private get type(): string {
        return this.props.data.type;
    }

    constructor(props: IActorProps) {
        super(props);

        this.state = {
            actorState: ActorState.Idle,
        };
    }

    public render(): JSX.Element {
        const { height, id, visible, width, x, y } = this.props.data;

        return (
            <div
                className={ `object object--${ this.type } object--${ id }` }
                style={
                    {
                        left: `${ x }px`,
                        height: `${ height }px`,
                        // TODO: This can't be right...
                        top: `${ y - height }px`,
                        width: `${ width }px`,
                        visibility: visible ? 'visible' : 'hidden',
                    }
                }
            ></div>
        );
    }
}
