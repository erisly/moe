/* eslint-disable @next/next/no-img-element */
import checkIcon from '@iconify/icons-mdi/check-bold';
import crossIcon from '@iconify/icons-mdi/close-thick';
import heartIcon from '@iconify/icons-mdi/heart';
import discordIcon from '@iconify/icons-simple-icons/discord';
import githubIcon from '@iconify/icons-simple-icons/github';
import { InlineIcon } from '@iconify/react';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Button, Constants, Head, Link, Loading } from '../components';
import erisly from '../public/emotes/hug.png';

interface AccountData {
    avatar: string;
    username: string;
}
interface Data {
    contributor: boolean;
    discord: AccountData;
    github: AccountData;
    inServer: boolean;
}
type StateData = { fetched: false } | { data: Data; fetched: true };
interface Props {
    complete: boolean;
}

const Page: NextPage<Props> = ({ complete }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [contributions, setContributions] = useState<StateData>({
        fetched: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/verify/validate`);
            if (res.status == 200) {
                const result = await res.json();
                setContributions({
                    data: result,
                    fetched: true,
                });
            } else {
                alert(await res.text());
                router.push('/verify');
            }
        };
        if (router.query.complete != null) fetchData();
    }, [router.query.complete, router]);

    return (
        <div className="text-white bg-erisly-600">
            <Head
                description="Verify your identity on Discord and GitHub to receive the Erisly.moe Contributor role in Erisly's Official Discord Server"
                title="Verify Your Contributions"
            />

            <main className="flex flex-wrap items-center justify-center min-h-screen gap-4 p-16 lg:flex-nowrap">
                {complete ? contributions.fetched ? <Results data={contributions.data} /> : <Verifying /> : <Information />}
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const complete = query.complete != null;
    return { props: { complete } };
};

const ErislyDiscordLink = () => <Link content="Erisly's Official Discord Server" href="https://discord.gg/erisly" />;

const ErislyGitHubLink = () => <Link content="Erisly.moe" href="https://github.com/erisly/moe" />;

const Verifying = () => (
    <>
        <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Give us a moment...</h1>
            <p>We're just checking your contributions on GitHub (and maybe giving you your role)</p>
            <Loading />
        </div>
    </>
);

const Results = ({ data }: { data: Data }) => (
    <div className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
            <div className="flex-1">
                <img alt="Discord Avatar" className="inline max-w-[256px] rounded-full" src={data.discord.avatar} />
                <p className="my-4 text-2xl font-bold sm:text-4xl">
                    <InlineIcon className="inline mr-4 text-discord" icon={discordIcon} />
                    {data.discord.username}
                </p>
                {data.inServer ? (
                    <p>
                        <InlineIcon className="inline mr-2 text-green-400" icon={checkIcon} />
                        You are in <ErislyDiscordLink />
                    </p>
                ) : (
                    <p>
                        <InlineIcon className="inline mr-2 text-red-400" icon={crossIcon} />
                        You are NOT in <ErislyDiscordLink />
                    </p>
                )}
            </div>
            <div className="flex-1">
                <img alt="GitHub Avatar" className="inline max-w-[256px] rounded-full" src={data.github.avatar} />
                <p className="my-4 text-2xl font-bold sm:text-4xl">
                    <InlineIcon className="inline mr-4 text-github" icon={githubIcon} />
                    {data.github.username}
                </p>
                {data.contributor ? (
                    <p>
                        <InlineIcon className="inline mr-2 text-green-400" icon={checkIcon} />
                        You are a contributor to <ErislyGitHubLink />
                    </p>
                ) : (
                    <p>
                        <InlineIcon className="inline mr-2 text-red-400" icon={crossIcon} />
                        You are NOT a contributor to <ErislyGitHubLink />
                    </p>
                )}
            </div>
        </div>
        {data.contributor && data.inServer ? (
            <>
                <p className="mb-4 text-4xl font-bold">Congratulations! You've been given the Erisly.moe Contributor role!</p>
                <p>
                    Thank you for your contributions! <InlineIcon className="inline text-red-400" icon={heartIcon} />
                </p>
            </>
        ) : (
            <></>
        )}
        {!data.inServer ? (
            <p className="text-2xl font-bold">
                You need to actually be in <ErislyDiscordLink /> before you can get yourself the contributor role!
            </p>
        ) : (
            <></>
        )}
        {!data.contributor ? (
            <p className="text-2xl font-bold">
                You need to actually contribute to <ErislyGitHubLink /> before you can get yourself the contributor role!
            </p>
        ) : (
            <></>
        )}
    </div>
);

const Information = () => (
    <>
        <div>
            <h1 className="text-4xl font-bold">Verify your Discord and GitHub accounts for your contributions!</h1>

            <p className="pt-8">
                Sign in with your Discord account to allow Erisly.moe to associate your Discord account with your GitHub account and verify your
                contributions!
            </p>
            <p>
                By doing this, you'll receive the "Erisly.moe Contributor" role on <ErislyDiscordLink />.
            </p>
            <br />
            <p>
                <strong>
                    However, you must first be in <ErislyDiscordLink /> before signing in with Discord below, and you must already be a contributor
                    for Erisly.moe, likely via having a Pull Request of yours successfully merged on the GitHub repository for the website.
                </strong>
            </p>
            <br />
            <p>
                Once you click the button below, you'll be navigated to sign in with your Discord account, requesting access to your username and
                Discord profile in order to identify yourself, and your Discord account's connections in order to determine your GitHub username and
                therefore your contributions.{' '}
                <strong>Be sure to have your correct GitHub account connected to your Discord account before continuing.</strong>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Button
                    className="text-xl font-bold"
                    content="Contribute if you haven't already"
                    href="https://github.com/erisly/moe.git"
                    icon={githubIcon}
                    iconSize={32}
                    subClassName="button-github"
                />
                <Button
                    className="text-xl font-bold"
                    content="Connect your Discord and GitHub accounts"
                    href={Constants.DISCORD.OAUTH.LINK}
                    iconSize={32}
                    icons={[discordIcon, githubIcon]}
                    noExternal
                    subClassName="button-discord-github"
                />
            </div>
        </div>
        <div className="flex-none">
            <Image alt="Erisly" className="rounded-md" height={256} quality="100" src={erisly} width={256} />
        </div>
    </>
);

export default Page;
