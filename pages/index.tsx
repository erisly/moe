import sitemapIcon from '@iconify/icons-mdi/sitemap';
import githubIcon from '@iconify/icons-simple-icons/github';
import type { NextPage } from 'next';
import Image from 'next/image';

import { Button, Constants, Head } from '../components';
import erisly from '../public/erisly/main.png';

const Page: NextPage = () => {
    return (
        <div className="text-white bg-erisly-600">
            <Head showHomeButton={false} />

            <main className="flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                <div className="sm:mx-24 object-fit relative h-72 w-72 sm:h-96 sm:w-96 md:h-[530px] md:w-[500px]">
                    <Image alt="Erisly" className="rounded-md" layout="fill" quality="100" src={erisly} />
                </div>
                <h1 className="pt-4 text-3xl font-bold sm:text-5xl md:text-8xl">erisly.moe</h1>
                <p className="pt-8">{Constants.SITE.DESCRIPTION}</p>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    <Button
                        className="text-xl font-bold"
                        content="Contribute"
                        href="https://github.com/erisly/moe.git"
                        icon={githubIcon}
                        iconSize={32}
                        subClassName="button-github"
                    />
                    <Button className="text-xl font-bold" content="Site Map" href="/sitemap" icon={sitemapIcon} iconSize={32} noExternal />
                </div>
            </main>
        </div>
    );
};

export default Page;
