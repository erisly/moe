import React, { ReactElement } from 'react';

export default function Link(props: {
    button?: boolean;
    children?: ReactElement | ReactElement[];
    className?: string;
    content?: string;
    href?: string;
    noExternal?: boolean;
}): ReactElement {
    return (
        <a
            className={`cursor-pointer ${props.button ? '' : 'link'} ${props.className}`}
            href={props.href}
            rel="noreferrer"
            target={props.noExternal ? undefined : '_blank'}
        >
            {props.content || props.children}
        </a>
    );
}
