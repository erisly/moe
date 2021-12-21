import githubIcon from '@iconify/icons-simple-icons/github';
import type { NextPage } from 'next';
import Image from 'next/image';

import { Button, Constants, Head } from '../components';

const Page: NextPage = () => {
    return (
        <div className="text-white bg-erisly-600">
            <Head />

            <main className="flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                <div className="sm:mx-24 leading-0">
                    <Image alt="Erisly" className="object-contain rounded-md" height={530} quality="100" src="/erisly.png" width={500} />
                </div>
                <h1 className="pt-4 font-bold text-8xl">Erisly.moe</h1>
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
