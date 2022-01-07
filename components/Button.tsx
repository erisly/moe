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
    contentClassName?: string;
    disabled?: boolean;
    hoverToShowContent?: boolean;
    href?: string;
    icon?: IconifyIcon;
    iconSize?: number;
    icons?: IconifyIcon[];
    noExternal?: boolean;
    onClick?: () => void;
    subClassName?: string;
}): ReactElement {
    const linkClassName = `group ${props.className || ''}`;
    const containerClassName = `flex items-center p-3 ${props.hoverToShowContent ? '' : 'space-x-3'} no-underline hover:button button rounded-3xl ${
        props.subClassName || ''
    }`;
    const containerStyle = { backgroundColor: props.colour?.bg, color: props.colour?.fg };
    const contentClassName = props.hoverToShowContent
        ? `max-w-0 transition-slide group-hover:max-w-sm group-hover:ml-3 ${props.contentClassName}`
        : props.contentClassName;
    const contentStyle = props.hoverToShowContent ? { clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0 100%)' } : undefined;

    const icons = props.icons || (props.icon ? [props.icon as IconifyIcon] : []);

    return (
        <Link button className={linkClassName} disabled={props.disabled} href={props.href} noExternal={props.noExternal} onClick={props.onClick}>
            <div className={containerClassName} style={containerStyle}>
                {icons[0] ? <InlineIcon height={props.iconSize || 16} icon={icons[0]} width={props.iconSize || 16} /> : null}
                <span className={contentClassName} style={contentStyle}>
                    {props.content}
                </span>
                {icons[1] ? <InlineIcon height={props.iconSize || 16} icon={icons[1]} width={props.iconSize || 16} /> : null}
            </div>
        </Link>
    );
}
