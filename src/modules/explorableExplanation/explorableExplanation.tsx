import * as React from 'react';
import * as content1 from './content1.html';
import * as content2 from './content2.html';

interface IExplorableExplanationProps {
    contentId: number;
}

const content = {
    content1,
    content2,
}

function getContent(contentId) {
    return content[`content${ contentId }`];
}

export const ExplorableExplanation: React.SFC<IExplorableExplanationProps> =
    (props: IExplorableExplanationProps): JSX.Element => {
        return (
            <div
                className="explorableExplanation"
                dangerouslySetInnerHTML={{ __html: getContent(props.contentId) }}
            ></div>
        );
    }