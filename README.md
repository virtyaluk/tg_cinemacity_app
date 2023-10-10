# Cinema City Telegram Mini App

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

The project root contains a separate dir for each client and server side of the app.  Make sure you installed Node dependencies for both client, server, and main tools.

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
Then the only thing left os to build the project:

```shell
$ yran build
```

Congrats! You're ready to run the thing up.

## Before running the project

Before you run the project, there are two things that you have to take care of beforehand: server certificates and the .env file containing your Telegram bot tokens.

### Server certificates

Telegram puts very strong rules on your Mini App and disallows to use of non-secure sources for the app. Thus, you have to run your app by means of HTTPS. This is already implemented in the given app so the only thing you are left with is to provide your own SSL certificate. The certs must be placed inside `./server/certs/ dir.

In my case, I'm using free [Let's Encrypt](https://letsencrypt.org/) certificates for my personal domain. You could use [certbot](https://tecadmin.net/how-to-generate-lets-encrypt-ssl-using-certbot/) to generate free certificates for your domain.

## Running the project

To run in a dev mode:

```shell
$ yarn start:dev
```

To run in a production mode:

```shell
$ yarn start 
```