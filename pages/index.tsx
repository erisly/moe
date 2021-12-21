import githubIcon from '@iconify/icons-simple-icons/github';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { Button } from '../components';

const DESCRIPTION = `Erisly.moe is (potentially) the best website on the Internet... with the power to make it so in your hands.`;

const Index: NextPage = () => {
    return (
        <div className="text-white bg-erisly-600">
            <Head>
                <title>Erisly.moe</title>
                <meta content={DESCRIPTION} name="description" />
                <meta content="#FF6394" name="theme-color" />
                <meta content="website" property="og:type" />
                <meta content="Erisly.moe" name="twitter:title" property="og:title" />
                <meta content={DESCRIPTION} name="twitter:description" property="og:description" />
                {/* TODO: Twitter Image
                    <meta content="https://erisly.moe/_next/image?url=%2Ferisly.png&w=256&q=100" name="twitter:image" property="og:image" />
                */}
                <meta content="summary" name="twitter:card" />
                <meta content="@ErislyBot" name="twitter:site" />
            </Head>
            <main className="flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                <div className="sm:mx-24 leading-0">
                    <Image alt="Erisly" className="object-contain rounded-md" height={530} quality="100" src="/erisly.png" width={500} />
                </div>
                <h1 className="pt-4 font-bold text-8xl">Erisly.moe</h1>
                <p className="pt-8">{DESCRIPTION}</p>
                <div className="flex space-x-4">
                    <Button
                        className="mt-8 text-xl font-bold"
                        content="Contribute"
                        href="https://github.com/erisly/moe.git"
                        icon={githubIcon}
                        iconSize={32}
                        subClassName="button-github"
                    />
                    <Button className="mt-8 text-xl font-bold" content="Site Map" href="/sitemap" icon="fa:sitemap" iconSize={32} noExternal />
                </div>
            </main>
        </div>
    );
};

export default Index;
