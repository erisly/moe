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
    const linkClassName = `group ${props.className}`;
    const containerClassName = `flex items-center p-3 ${props.hoverToShowContent ? '' : 'space-x-3'} no-underline hover:button button rounded-3xl ${
        props.subClassName
    }`;
    const containerStyle = { backgroundColor: props.colour?.bg, color: props.colour?.fg };
    const contentClassName = props.hoverToShowContent ? 'max-w-0 transition-slide group-hover:max-w-sm group-hover:ml-3' : undefined;
    const contentStyle = props.hoverToShowContent ? { clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0 100%)', color: 'black' } : undefined;

    return (
        <Link button className={linkClassName} href={props.href} noExternal={props.noExternal}>
            <div className={containerClassName} style={containerStyle}>
                {props.icon ? <InlineIcon height={props.iconSize || 16} icon={props.icon} width={props.iconSize || 16} /> : null}
                <span className={contentClassName} style={contentStyle}>
                    {props.content}
                </span>
            </div>
        </Link>
    );
}
