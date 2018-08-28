import * as React from 'react';

const c000 = require('./c000.html');
const c001 = require('./c001.html');
const c002 = require('./c002.html');
const c003 = require('./c003.html');

export type ContentId = 'c000' | 'c001' | 'c002' | 'c003';

interface IExplorableExplanationProps {
  contentId: ContentId;
}

const content = {
  c000,
  c001,
  c002,
  c003,
}

function getContent(contentId) {
  return content[contentId];
}

const ExplorableExplanation: React.SFC<IExplorableExplanationProps> =
  (props: IExplorableExplanationProps): JSX.Element => {
    return (
      <div
        className="explorableExplanation"
        dangerouslySetInnerHTML={{ __html: getContent(props.contentId) }}
      ></div>
    );
  }

export { ExplorableExplanation };