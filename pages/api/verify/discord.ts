import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Constants } from '../../../components';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const code = req.query.code as string;

    const accessToken = (
        await (
            await fetch('https://discord.com/api/oauth2/token', {
                body: new URLSearchParams({
                    client_id: Constants.DISCORD.CLIENT_ID,
                    client_secret: Constants.DISCORD.OAUTH.SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: Constants.DISCORD.OAUTH.REDIRECT_URI,
                    scope: Constants.DISCORD.OAUTH.SCOPE,
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
            })
        ).json()
    ).access_token;

    const cookies = new Cookies(req, res);
    cookies.set('discordToken', accessToken);
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${Constants.GITHUB.OAUTH.CLIENT_ID}`);
}
