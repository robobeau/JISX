import * as React from 'react';

interface IActorProps {
    position: {
        x: number;
        y: number;
    }
}

interface IActorState {}

export class Actor extends React.Component<IActorProps, IActorState> {
    public props: IActorProps;
    public state: IActorState;

    constructor(props: IActorProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <div className="actor"></div>
        );
    }
}
