# Snipcode

Snipcode is a simple easy-to-use pastebin, primarily focused (but not limited to) for sharing code.
It also serves as a link shortener.

## Official instance
https://snipcode.link (and domain for shortcuts is https://snipco.de)

## Self-hosting Snipcode

You are free to self-host Snipcode and maintain your own instance. This guide will tell you how.

### Requirements

- Node.js 
    - tested on 14.x, 15.x; older versions should work but are not tested
    - For installation, see https://nodejs.org/en/download
- Yarn
    - required because of Yarn workspaces
    - can be installed via `npm i -g yarn`
- SQL database
    - Mainly developed to work with SQLite, but should work with other SQL databases.
    - Snipcode uses Prisma for DB interaction, see [Prisma Docs/Supported Databases](https://www.prisma.io/docs/reference/database-reference/supported-databases) for a list of supported databases.

Additionally, you might want to setup Nginx/Apache as a reverse-proxy. Right now, only Nginx is supported,
as Apache2 has issues with proxying WebSockets.

### Download Snipcode

To get started, create a folder where you want to install Snipcode:
```ts
mkdir -p /etc/snipcode
cd /etc/snipcode
```
*(Assuming you want to store Snipcode in `/etc/snipcode`)*

Then download the latest release of Snipcode:
```shell
$ curl -Lo snipcode.tar.gz https://github.com/snipcode/snipcode/releases/latest/download/snipcode.tar.gz
$ tar -xzvf snipcode.tar.gz
```

### Setup the database

If you are going to use SQLite, all you need to do is just create an empty file:
```shell
# Create a db folder
$ mkdir db
# Create the database file
$ touch db/prod.db
```

If you are going to use any other SQL database (for example MySQL/Postgres) // WIP

### Install dependencies

This will install all required dependencies:

```
yarn install
```

### Configuring Snipcode

First, copy over the default configuration file (`.env.example`) into `.env`.

```shell
$ cp .env.example .env
```

Next, open the .env file in a editor of your preference and fill it out:

```
PORT=<port for the backend, for example 3000>
HOST=<host that the backend listens to>
NODE_ENV=production
APP_KEY=<leave blank for now>
DATABASE_URL=<database url, or `file:../db/prod.db for SQLite`>
```

### Build Snipcode

Snipcode needs to be compiled from TypeScript to JavaScript so Node.js can run it. It will also build the Vue.js frontend:

```
yarn build
```

### Run Snipcode

Start the Snipcode server:

```
yarn prod
```

### Creating a service

In order for the Snipcode server to not shutdown once you logout out of your server, you need to create a system service. You can do so by placing this in a file `/etc/systemd/system/snipcode.service`:

```
[Unit]
Description=Snipcode Server

[Service]
User=root
WorkingDirectory=/etc/snipcode
LimitNOFILE=4096
ExecStart=/usr/local/bin/yarn prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
