import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Constants } from '../../../components';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const code = req.query.code as string;

    const accessToken = (
        await (
            await fetch(`https://github.com/login/oauth/access_token`, {
                body: new URLSearchParams({
                    client_id: Constants.GITHUB.OAUTH.CLIENT_ID,
                    client_secret: Constants.GITHUB.OAUTH.SECRET,
                    code,
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
            })
        ).text()
    )
        .split('access_token=')[1]
        .split('&')[0];

    const cookies = new Cookies(req, res);
    cookies.set('githubToken', accessToken);
    res.redirect(`/verify?complete`);
}
