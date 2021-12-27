export const DISCORD = {
    BOT_TOKEN: process.env.DISCORD_BOT_TOKEN ?? '',
    CLIENT_ID: process.env.DISCORD_CLIENT_ID ?? '',
    ID: {
        CONTRIBUTOR_ROLE: process.env.DISCORD_ID_CONTRIBUTOR_ROLE ?? '',
        GUILD: process.env.DISCORD_ID_GUILD ?? '',
    },
    OAUTH: {
        LINK: '',
        REDIRECT_URI: process.env.DISCORD_OAUTH_REDIRECT_URI ?? '',
        SCOPE: process.env.DISCORD_OAUTH_SCOPE ?? '',
        SECRET: process.env.DISCORD_OAUTH_SECRET ?? '',
    },
    SERVER_INVITE: 'https://discord.gg/erisly',
};

export const GITHUB = {
    OAUTH: {
        CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID ?? '',
        SECRET: process.env.GITHUB_OAUTH_SECRET ?? '',
    },
    REPOSITORY: 'https://github.com/erisly/moe',
};

export const SITE = {
    COLOR: '#FF6394',
    DESCRIPTION: 'Erisly.moe is (potentially) the best website on the Internet... with the power to make it so in your hands.',
    IMAGE: 'erisly.png',
    TITLE: 'Erisly.moe',
};

DISCORD.OAUTH.LINK = `https://discord.com/oauth2/authorize?client_id=${DISCORD.CLIENT_ID}&redirect_uri=${encodeURIComponent(
    DISCORD.OAUTH.REDIRECT_URI
)}&response_type=code&scope=${encodeURIComponent(DISCORD.OAUTH.SCOPE)}`;
