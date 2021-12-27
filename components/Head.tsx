import NextJSHead from 'next/head';
import React, { ReactElement } from 'react';

import { Constants, HomeButton } from '.';

export default function Head(props: { color?: string; description?: string; image?: string; title?: string }): ReactElement {
    return (
        <>
            <NextJSHead>
                <title>{props.title || Constants.SITE.TITLE}</title>
                <meta content={props.description || Constants.SITE.DESCRIPTION} name="description" />
                <meta content={props.color || Constants.SITE.COLOR} name="theme-color" />
                <meta content="website" property="og:type" />
                <meta content={props.title || Constants.SITE.TITLE} name="twitter:title" property="og:title" />
                <meta content={props.description || Constants.SITE.DESCRIPTION} name="twitter:description" property="og:description" />
                <meta content={`https://erisly.moe/${props.image || Constants.SITE.IMAGE}`} name="twitter:image" property="og:image" />
                <meta content="summary" name="twitter:card" />
                <meta content="@ErislyBot" name="twitter:site" />
            </NextJSHead>

            <HomeButton />
        </>
    );
}
