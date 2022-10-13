# Snipcode

Snipcode is a simple easy-to-use pastebin, primarily focused on (but not limited to) sharing code.

## Official instance

https://snipcode.link

## Self-hosting Snipcode

You are free to self-host Snipcode and maintain your own instance. Follow this guide to setup your own Snipcode instance.

### Requirements

- Node.js
  - tested on 14.x, 15.x
  - older versions haven't been tested and are not officially supported
  - For installation, see https://nodejs.org/en/download
- Yarn
  - required because of Yarn workspaces
  - can be installed via `npm i -g yarn`
- A database
  - Snipcode is developed to work with SQLite and at the moment that is the only supported data source. This should however change with v3.
- Reverse proxy (optional)
  - you might want to setup Nginx/Apache as a reverse-proxy.
  - Snipcode fully supports only Nginx at the moment as Apache2 has issues with WebSockets.

### Download Snipcode

To get started, create a folder where you want to install Snipcode:

```ts
mkdir -p /etc/snipcode
cd /etc/snipcode
```

_(Assuming you want to store Snipcode in `/etc/snipcode`)_

Then download the latest release of Snipcode:

```shell
$ curl -Lo snipcode.tar.gz https://github.com/snipcode/snipcode/releases/latest/download/snipcode.tar.gz
$ tar -xzvf snipcode.tar.gz
```

### Setup the database

To setup SQLite, all you need to do is just create an empty database file:

```shell
# Create a db folder
$ mkdir db
# Create the database file
$ touch db/prod.db
```

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

Next, open the .env file in an editor of your preference and fill it out:

```
NODE_ENV=production
FRONTEND_URL=<domain, including http(s)://>
DATABASE_URL=file:../db/prod.db
```

### Generate a secret key

To generate a secret key, simply run: 
```shell
$ ./node_modules/.bin/secure-session-gen-key > sess_secret
```

### Build Snipcode

Snipcode is written in TypeScript and needs to be transpiled to JavaScript so Node.js can run it. Additionally, the frontend is built with Vue.js and needs to be compiled as well.

```
yarn build
```

### Run Snipcode

Start the Snipcode server:

```
yarn prod
```

### Creating a service

If you don't want your Snipcode instance to shutdown at the end of the session, you need to create a system service. You can do so by placing this in a file `/etc/systemd/system/snipcode.service`:

```
[Unit]
Description=Snipcode Server

[Service]
User=root
WorkingDirectory=/etc/snipcode
LimitNOFILE=4096
ExecStart=/usr/local/bin/yarn backend prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

#### Setting up nginx

Here is the config for nginx which should be filled in a new file at `/etc/nginx/sites-available/snipcode.conf`:

Replace <domain> with you domain name / IP address.

```nginx
server {
    listen 80;
    server_name <domain>;

    root /etc/snipcode/packages/frontend/build/;
    index index.html;
    charset utf-8;

    location / {
      try_files $uri $uri/ /index.html?$query_string;
    }

    location /api/ {
      proxy_pass http://localhost:4200/;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/snipcode.error.log error;

    # allow larger file uploads and longer script runtimes
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ /\.ht {
        deny all;
    }
}
```
