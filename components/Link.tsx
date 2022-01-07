import NextLink from 'next/link';
import React, { ReactElement } from 'react';

const Link = (props: {
    button?: boolean;
    children?: ReactElement | ReactElement[];
    className?: string;
    content?: string;
    disabled?: boolean;
    href?: string;
    noExternal?: boolean;
    onClick?: () => void;
}): ReactElement =>
    props.href?.startsWith('/') ? (
        <NextLink href={props.href}>
            <a className={`cursor-pointer ${props.button ? '' : 'link'} ${props.className || ''}`}>{props.content || props.children}</a>
        </NextLink>
    ) : (
        <a
            className={`cursor-pointer ${props.button ? '' : 'link'} ${props.className || ''} ${props.disabled == true ? 'disabled' : ''}`}
            href={props.href}
            onClick={props.onClick}
            rel="noreferrer"
            target={props.noExternal ? undefined : '_blank'}
        >
            {props.content || props.children}
        </a>
    );

export default Link;
