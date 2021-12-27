import Image from 'next/image';
import React, { ReactElement } from 'react';

// fuck you: puts an entire base64 gif in the code
// this is the "most effective" way to have an animated image as a loading indicator that will load before the page loads
const loading = `data:image/gif;base64,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`;

export default function Loading(): ReactElement {
    return <Image alt="Erisly" className="rounded-md" height={128} quality="100" src={loading} width={128} />;
}