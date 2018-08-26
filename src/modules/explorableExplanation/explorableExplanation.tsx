import * as React from 'react';

const content1 = require('./content1.html');
const content2 = require('./content2.html');

export type ContentKey = 'content1' | 'content2';

interface IExplorableExplanationProps {
  contentId: ContentKey;
}

const content = {
  content1,
  content2,
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