import '../styles/globals.css';

import type { AppProps } from 'next/app';

function ErislyMoe({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />;
}

export default ErislyMoe;
