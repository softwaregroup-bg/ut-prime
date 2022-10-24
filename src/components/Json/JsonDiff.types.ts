import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    highlightAdditions?: boolean,
    isInlineView?: boolean,
    highlightDeletions?: boolean,
    highlightChangedValues?: boolean,
    showUnchangedValues?: boolean,
    left?: unknown,
    right?: unknown,
}

export type ComponentProps = React.FC<Props>
