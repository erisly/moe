import githubIcon from '@iconify/icons-simple-icons/github';
import { promises as fs } from 'fs';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import { Button, Head } from '../components';

interface Props {
    pages: Record<string, unknown>;
}

const Page: NextPage<Props> = ({ pages }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div className="min-h-screen text-white bg-erisly-600">
            <Head description="A list of all available pages on Erisly.moe" title="Erisly.moe - Site Map" />

            <main className="p-8">
                <h1 className="text-4xl font-bold">Erisly.moe - Site Map</h1>

                <ul className="mt-4 list-disc list-inside">{traversePages(pages)}</ul>

                <Button
                    className="inline-block mt-8 text-xl font-bold"
                    content="Make your own page"
                    href="https://github.com/erisly/moe.git"
                    icon={githubIcon}
                    iconSize={32}
                    subClassName="button-github"
                />
            </main>
        </div>
    );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const paths = await traverseFiles('pages');
    const pages: Record<string, unknown> = {};
    paths.forEach((path) => {
        const levels = ['/', ...path.split('/').slice(1)];
        let currentLevel = pages;
        levels.forEach((level, i) => {
            if (!currentLevel[level]) {
                if (i == levels.length - 1) currentLevel[level] = true;
                else currentLevel[level] = {};
            }
            currentLevel = currentLevel[level] as Record<string, unknown>;
        });
    });

    return {
        props: {
            pages,
        },
    };
};

async function traverseFiles(path: string): Promise<string[]> {
    let pages: string[] = [];
    const items = await fs.readdir(path);
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // eslint-disable-next-line prefer-const
        let [name, extension] = item.split('.');
        const isDir = extension == null;
        if (name.startsWith('_') || name == 'api') continue;
        const pathName = `${path.slice(5)}/${name}`; // remove 'pages' prefix
        if (isDir) pages = pages.concat(await traverseFiles(`${path}/${item}`));
        else pages.push(pathName);
    }
    return pages;
}

function traversePages(pages: Record<string, unknown>, path = [] as string[]): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    Object.keys(pages).forEach((levelName) => {
        const level = pages[levelName];
        const formattedPath = `${path.map((p) => `${p == '/' ? '' : `/${p}`}`).join('')}/${levelName == '/' ? '' : levelName}`;
        if (typeof level == 'object') {
            const hasIndex = (level as Record<string, unknown>).index != null;

            result.push(
                <li key={levelName}>
                    <a className={`font-bold ${hasIndex ? 'link' : ''}`} href={hasIndex ? formattedPath : undefined}>
                        {levelName}
                    </a>
                    <ul className="pl-8 list-disc list-inside">{traversePages(level as Record<string, unknown>, [...path, levelName])}</ul>
                </li>
            );
        } else if (levelName != 'index') {
            result.push(
                <li key={levelName}>
                    <a className="link" href={formattedPath}>
                        {levelName}
                    </a>
                </li>
            );
        }
    });
    return result;
}

export default Page;
