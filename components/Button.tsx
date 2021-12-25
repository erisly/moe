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
    hoverToShowContent?: boolean;
    href?: string;
    icon?: IconifyIcon | string;
    iconSize?: number;
    noExternal?: boolean;
    subClassName?: string;
}): ReactElement {
    return (
        <Link button className={`group ${props.className}`} href={props.href} noExternal={props.noExternal}>
            <div
                className={`flex items-center p-3 ${props.hoverToShowContent ? '' : 'space-x-3'} no-underline hover:button button rounded-3xl ${
                    props.subClassName
                }`}
                style={{
                    backgroundColor: props.colour?.bg,
                    color: props.colour?.fg,
                }}
            >
                {props.icon ? <InlineIcon height={props.iconSize || 16} icon={props.icon} width={props.iconSize || 16} /> : null}
                <span
                    className={props.hoverToShowContent ? 'max-w-0 transition-slide group-hover:max-w-sm group-hover:ml-3' : undefined}
                    style={props.hoverToShowContent ? { clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0 100%)', color: 'black' } : undefined}
                >
                    {props.content}
                </span>
            </div>
        </Link>
    );
}
