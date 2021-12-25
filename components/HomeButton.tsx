import React, { ReactElement } from 'react';

import { Button } from '.';

export default function HomeButton(): ReactElement {
    return (
        <Button
            className="absolute bottom-0 left-0 z-50 m-4 md:m-8"
            content="Home"
            hoverToShowContent
            href="/"
            icon="fa:home"
            iconSize={32}
            noExternal
        />
    );
}
