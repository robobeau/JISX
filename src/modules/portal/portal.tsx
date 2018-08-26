import * as React from 'react';
import { BaseObjectComponent, IBaseObjectProps } from '../baseObject/baseObject';

interface IPortalProps extends IBaseObjectProps {}

interface IPortalState {}

export class Portal extends React.Component<IPortalProps, IPortalState> {
  constructor(props: IPortalProps) {
    super(props);

    this.state = {};
  }

  public render(): JSX.Element {
    return <BaseObjectComponent { ...this.props } />;
  }
}