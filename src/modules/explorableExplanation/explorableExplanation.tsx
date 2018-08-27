import * as React from 'react';

const c000 = require('./c000.html');
const c001 = require('./c001.html');

export type ContentId = 'c000' | 'c001';

interface IExplorableExplanationProps {
  contentId: ContentId;
}

const content = {
  c000,
  c001,
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