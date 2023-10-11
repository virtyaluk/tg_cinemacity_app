# Cinema City Telegram Mini App

This is a demonstration app that utilizes Telegram features like [Bot API](https://core.telegram.org/bots/api), [Mini Apps](https://core.telegram.org/bots/webapps#initializing-mini-apps), [Payments API](https://core.telegram.org/bots/payments), and [The Movies DataBase](https://www.themoviedb.org/) API to build a ticket application for a fictional cinema called Cinema City.

> [@CinemaCityAppBot](https://t.me/CinemaCityAppBot) is the only mobile movie ticketing app that lets you buy movie tickets, make movie plans with friends & get a VIP experience at the theater so you never wait in line. When you get to the movie theater, skip the box office line & scan your digital movie ticket with your phone.

![app presentation](https://github.com/virtyaluk/tg_cinemacity_app/assets/795984/1db89826-6205-444c-9975-626a7b90b000)

Some of the app features include:
- a nice responsive UI with the support of Telegram's [dynamic color schema change](https://core.telegram.org/bots/webapps#themeparams);
- builtin multi-language support for the client application;
- seamless payment process using Telegram's [Payments API](https://core.telegram.org/bots/payments);
- use of the [CloudStorage](https://core.telegram.org/bots/webapps#cloudstorage) API to store the app configs;
- [haptic feedback](https://core.telegram.org/bots/webapps#hapticfeedback) to make the user's experience even funnier.

The app is built using [TypeScript](https://www.typescriptlang.org/), [Node.js](https://nodejs.org/en), [React](https://react.dev/), [telegraf](https://github.com/telegraf/telegraf), and [Express](https://expressjs.com/).

## Getting started

Before you start, make sure you have everything you may need to build and run the app.

For this project, you have to have `Node.js` version 17 and `yarn` package manager installed on your system.

You may want to try [nvm](https://github.com/nvm-sh/nvm) to manage Node installations in your system:

```shell
$ nvm install v17

$ node --version
v17.9.1

$ npm --version
8.11.0
```
Install [yarn](https://yarnpkg.com/):

```shell
$ npm i -g yarn
$ yarn --version
1.22.19
```

This is all you need to build the project.

## Building the project

Clone the project's repo:

```shell
$ git clone git@github.com:virtyaluk/tg_cinemacity_app.git
$ cd ./tg_cinemacity_app
```

The project root contains a separate dir for each client and server side of the app. Make sure you installed Node dependencies for both client, server, and main tools.

From the root of the repo execute the following:

```shell
$ yarn install
```

Then do the same for the server part:

```shell
$ cd ./server
$ yarn install
$ cd ../
```

and the client part:

```shell
$ cd ./client
$ yarn install
$ cd ../

```
Then the only thing left us to build the project:

```shell
$ yran build
```

Congrats! You're ready to run the thing up.

## Before running the project

Before you run the project, there are two things that you have to take care of beforehand: server certificates and the `.env` file containing your Telegram bot tokens.

### Server certificates

Telegram puts very strong rules on your Mini App and disallows to use of non-secure sources for the app. Thus, you have to run your app by means of HTTPS. This is already implemented in the given app so the only thing you are left with is to provide your own SSL certificate. The certs must be placed inside `./server/certs/` dir.

In my case, I'm using free [Let's Encrypt](https://letsencrypt.org/) certificates for my personal domain. You could use [certbot](https://tecadmin.net/how-to-generate-lets-encrypt-ssl-using-certbot/) to generate free certificates for your domain.

Or, if you are only going to run this app locally, use these commands to generate self-signed certificates:

```shell
# Generate private key
$ openssl genrsa -out key.pem

# Create Certificate Signing Request
$ openssl req -new -key key.pem -out csr.pem

# Generate the SSL certificate
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

Make sure you have both `cert.pem` and `key.pem` in your server's `certs` dir:

```shell
$ ls ./server/certs
cert.pem  key.pem
```

### .env file

Make sure to update `.env` file in the root of the server folder with your Telegram bot configuration and TMDb access token.

For the Telegram part, you need to create your custom bot by means of [@BotFather](https://t.me/botfather) and set up a payment provider for the newly created bot which will yield you tokens for the bot itself and for the payments API.

Use the following guides to get the relevant tokens:

- [Telegram Bots > From BotFather to 'Hello World'](https://core.telegram.org/bots/tutorial#obtain-your-bot-token)
- [Bot Payments API > Connecting Payments](https://core.telegram.org/bots/payments#connecting-payments)

Since this app relies on data from The Movie Database, you have to obtain a separate set of tokens for the TMDb API:

- [Get started with the basics of the TMDB API](https://developer.themoviedb.org/docs)

Your `.env` file should look like this now:

```dotenv
TMDB_API_KEY="your_tmdb_api_key"
TMDB_ACCESS_TOKEN="your_tmdb_access_token"
BOT_TOKEN="your_bot_token"
PROVIDER_TOKEN="your_provider_token"
```

And you're finally good to go.

## Running the project

### dev mode

To run the project in `development` mode, do this:

```shell
$ yarn start:dev
```

This will bring up your server on a separate port (`4000`, by default) and will continue to watch any code changes to apply them live.

It will also run the frontend as a separate instance on port `8080` with the support of hot reloading.

This running mode is suitable for local development and debugging.

**NOTE:** *Sometimes, the dev server fails to release port listeners upon the close making it impossible to restart the application backend. In this case, you need to find a dangling process sitting on the locked port and kill it.*

### prod mode

The `production` server will create a single process for both the client and the server:

```shell
$ yarn start 
```

## Debugging

Given that the Telegram Mini App web script isn't of any use while running locally, to lighten the burden of application debugging the app code exposes a couple of helper functions as the properties on the global `window` object:
- a call to the `window.TgApp.mainBtnClickHandler` simulates a click on the main button and executes any handler you happen to assign using [`WebApp.MainButton.onClick`](https://core.telegram.org/bots/webapps#mainbutton)
- while `window.tgApp.backBtnClickHandler` does the same but for the Back button. 

## The project structure

The project is split into two components - the server part and the client part.

### Server

```shell

├── server
│   ├── certs
│   └── src
│       ├── config
│       ├── middleware
│       ├── models
│       │   └── services
│       ├── routes
│       │   └── api
│       ├── services
│       ├── types
│       └── utils
```

- `certs` is where your SSL certs go.
- `src/config` is for the dev/prod server configuration.
- `src/middleware` isn't really used.
- `src/models` is where all custom types and interfaces for the server entities are stored.
- `src/routes` is for API routes definition.
- `src/services` holds a bunch of backend services like the main db service, TMDb service, Telegram Bot service, etc.
- `src/types` is used to store custom TypeScript type definitions.
- `src/utils` holds a set of helper functions.

### Client

```shell
├── client
│   ├── public
│   │   └── assets
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   │   └── placeholders
│   │   ├── config
│   │   ├── context
│   │   ├── hooks
│   │   ├── locales
│   │   ├── services
│   │   ├── utils
│   │   └── views
```

- `public` is used to store the app's public assets like index.html, favicon, and static pictures.
- `src/api` is where the main interactions with server API are happening.
- `src/components` holds the most of UI components written using React.
- `src/config` responsible for application configuration. For example, this is the place where the server API base URL is stored for both dev and prod.
- `src/context` is for custom app contexts available globally through the React runtime.
- `src/hooks` is for custom React hooks.
- `src/locales` is the place where translated strings for the app are stored. Currently, English and Ukrainian are supported.
- `src/services` is for a set of application services like a wrapper for the Telegram WebApp component.
- `src/utils` holds a set of helper functions.
- `src/views` stores main application views (i.e. screens).


## :green_book: License

Licensed under the MIT License.

Copyright (c) 2023 Bohdan Shtepan

---

> [shtepan.com](http://shtepan.com) &nbsp;&middot;&nbsp;
> [modern-dev.com](http://modern-dev.com) &nbsp;&middot;&nbsp;
> GitHub [@virtyaluk](https://github.com/virtyaluk)
