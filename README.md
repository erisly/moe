# erisly.moe

erisly.moe is (potentially) the best website on the Internet... with the power to make it so in your hands.

erisly.moe is a website about Erisly. What exactly about Erisly is up to you. The repository is public and anyone can submit possible changes or additions through pull requests.

The website can be accessed at, you guessed it, [erisly.moe](https://erisly.moe).

## Contributing
Simply fork the repository, make your changes, and submit a pull request! Any inappropriate or "not Erisly approved" changes will be rejected.

If you simply have a suggestion for someone else to possibly add, create an issue!

Not sure where to start? Check the rest of this README, existing issues, or the [index webpage](https://erisly.moe/) (located in `src/pages/index.astro`) for a good starting point on how pages are made.

## Initial Setup
1. Clone the repository.
2. Run `yarn install` to install the dependencies (not npm).
3. Run `yarn dev` to start the development server.
4. For coding, it's recommended to use [Visual Studio Code](https://code.visualstudio.com/download) with the extensions it will recommend for you to install.

## Project Structure
The project is powered by [Astro](https://astro.build).

Inside of this Astro project, you'll see the following folders:

```
/
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    ├── layouts/
    │   └── ...
    └── pages/
        └── ...
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro components.

Any static assets, like images, can be placed in the `public/` directory.

## Commands
All commands are run from the root of the project, from a terminal:

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `yarn install`      | Installs dependencies                            |
| `yarn dev`          | Starts local dev server at `localhost:3000`      |
| `yarn build`        | Build your production site to `./dist/`          |
| `yarn preview`      | Preview your build locally, before deploying     |
| `yarn astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `yarn astro --help` | Get help using the Astro CLI                     |

## Want to learn more about Astro?
Feel free to check [Astro's documentation](https://docs.astro.build).
