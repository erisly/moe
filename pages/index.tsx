import githubIcon from '@iconify/icons-simple-icons/github';
import type { NextPage } from 'next';
import Image from 'next/image';

import { Button, Constants, Head } from '../components';
import erisly from '../public/erisly.png';

const Page: NextPage = () => {
    return (
        <div className="text-white bg-erisly-600">
            <Head />

            <main className="flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                <div className="sm:mx-24 leading-0 object-fit relative h-72 w-72 sm:h-96 sm:w-96 md:h-[530px] md:w-[500px]">
                    <Image alt="Erisly" className="rounded-md" layout="fill" quality="100" src={erisly} />
                </div>
                <h1 className="pt-4 font-bold text-3xl sm:text-5xl md:text-8xl">Erisly.moe</h1>
                <p className="pt-8">{Constants.DESCRIPTION}</p>

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

export default Page;
