import { IconifyIcon, InlineIcon } from '@iconify/react';
import React, { ReactElement } from 'react';

import { Link } from '.';

export default function Button(props: {
    className?: string;
    colour?: {
        bg?: string;
        fg?: string;
    };
    content?: string;
    href?: string;
    icon?: IconifyIcon;
    iconSize?: number;
    noExternal?: boolean;
    subClassName?: string;
}): ReactElement {
    return (
        <Link button className={props.className} href={props.href} noExternal={props.noExternal}>
            <div
                className={`flex items-center p-3 space-x-3 no-underline hover:button button rounded-3xl ${props.subClassName}`}
                style={{ backgroundColor: props.colour?.bg, color: props.colour?.fg }}
            >
                {props.icon ? <InlineIcon icon={props.icon} width={props.iconSize || 16} /> : null} <span>{props.content}</span>
            </div>
        </Link>
    );
}
