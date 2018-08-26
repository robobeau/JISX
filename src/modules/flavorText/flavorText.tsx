import * as React from 'react';
import { BaseObjectComponent, IBaseObjectProps } from '../baseObject/baseObject';

interface IFlavorTextProps extends IBaseObjectProps {}

interface IFlavorTextState {}

export class FlavorText extends React.Component<IFlavorTextProps, IFlavorTextState> {
  constructor(props: IFlavorTextProps) {
    super(props);

    this.state = {};
  }

  public render(): JSX.Element {
    return <BaseObjectComponent { ...this.props } />;
  }
}