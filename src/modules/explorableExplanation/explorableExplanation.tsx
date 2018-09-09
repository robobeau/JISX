import * as React from 'react';

const c000 = require('./c000.html');
const c001 = require('./c001.html');
const c002 = require('./c002.html');
const c003 = require('./c003.html');
const content: { [key in ContentId]: any } = {
  c000,
  c001,
  c002,
  c003,
}

export enum ContentId {
  c000 = 'c000',
  c001 = 'c001',
  c002 = 'c002',
  c003 = 'c003',
}

interface IExplorableExplanationProps {
  contentId: ContentId;
}

const ExplorableExplanation: React.SFC<IExplorableExplanationProps> =
  (props: IExplorableExplanationProps): JSX.Element => {
    return (
      <div
        className="explorableExplanation"
        dangerouslySetInnerHTML={{ __html: content[props.contentId] }}
      ></div>
    );
  }

export { ExplorableExplanation };