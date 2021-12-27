import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Constants } from '../../../components';

type Data = {
    contributor: boolean;
    discord: {
        avatar: string;
        username: string;
    };
    github: {
        avatar: string;
        username: string;
    };
    inServer: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
    const cookies = new Cookies(req, res);

    const discordToken = cookies.get('discordToken');
    const githubToken = cookies.get('githubToken');
    if (!discordToken || !githubToken) {
        res.status(400).end('Session expired. Please try again.');
        return;
    }

    const discordInfo = (await (
        await fetch('https://discord.com/api/v9/users/@me', {
            headers: { Authorization: `Bearer ${discordToken}` },
        })
    ).json()) as { avatar: string; id: string; username: string };
    const githubInfo = (await (
        await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${githubToken}` },
        })
    ).json()) as { avatar_url: string; login: string };

    // we authenticate with the user's github token so the ratelimits will apply to their account instead of our server if they try to spam us :troll:
    const contributors = (
        (await (
            await fetch('https://api.github.com/repos/erisly/moe/contributors', {
                headers: { Authorization: `Bearer ${githubToken}` },
            })
        ).json()) as {
            login: string;
        }[]
    ).map((c) => c.login);

    const memberInfo = (await (
        await fetch(`https://discord.com/api/v9/guilds/${Constants.DISCORD.ID.GUILD}/members/${discordInfo.id}`, {
            headers: { Authorization: `Bot ${Constants.DISCORD.BOT_TOKEN}` },
        })
    ).json()) as { code: number } | { code: undefined };

    const contributor = contributors.includes(githubInfo.login);
    const inServer = memberInfo.code == null;

    if (contributor && inServer) {
        await fetch(
            `https://discord.com/api/v9/guilds/${Constants.DISCORD.ID.GUILD}/members/${discordInfo.id}/roles/${Constants.DISCORD.ID.CONTRIBUTOR_ROLE}`,
            {
                headers: {
                    Authorization: `Bot ${Constants.DISCORD.BOT_TOKEN}`,
                    'X-Audit-Log-Reason': 'Erisly.moe Contributor. GitHub: ' + githubInfo.login,
                },
                method: 'PUT',
            }
        );
    }

    res.status(200).json({
        contributor,
        discord: {
            avatar: 'https://cdn.discordapp.com/avatars/' + discordInfo.id + '/' + discordInfo.avatar + '.png?size=256',
            username: discordInfo.username,
        },
        github: {
            avatar: githubInfo.avatar_url,
            username: githubInfo.login,
        },
        inServer,
    });
}
