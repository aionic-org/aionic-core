# aionic-core

![alt text](https://avatars0.githubusercontent.com/u/42389304?s=100&v=4 'Aionic Logo')

[![Build Status](https://travis-ci.org/aionic-org/aionic-core.svg?branch=master)](https://travis-ci.org/aionic-org/aionic-core)

Aionic offers open source applications for project management and collaboration. Our focus is on simplifying and accelerating the workflow of agile teams.

## About Aionic

We provide a set of **open source products** for project management, collarboration, productivity and more. All our products are released under the [MIT](https://opensource.org/licenses/MIT) license, so feel free to customize them according to your team’s wishes.

Please keep in mind that we just develop the software and don't host the applications anywhere for public usage. That means you have to take care of the hosting for yourself. You can use a Linux cloud server with nginx for example.

All our products are built on top of [aionic-core](https://github.com/aionic-org/aionic-core/), since this is the place where all your data is maintained and distributed. So for the usage of any other application, you have to use at least aionic-core.

Moreover we highly advice to use [aionic-backend](https://github.com/aionic-org/aionic-backend/) for managing and configuring the data of your Aionic applications.

Installation and usage guides and be found at the GitHub repositories of the individual products.

Some of the technologies we use to build our software:

- Node.js
- React
- MySQL
- Redis

---

## Description

**aionic-core** is the foundation for any other of our applications, since it's the place to store and distribute all your data to the clients. The application is a REST API written in Typescript and based on an Express.js HTTP server.

Some of the features included in this app:

- REST API
- Mail Service
- MySQL ORM
- Caching
- GitHub API
- Permission control via ACL
- Authentication via JWT or basic-auth

## Prerequisites

- Node.js
- MySQL database
- Redis server for caching
- SMTP server for mail transfer

## Installation

First of all, create a new database on your MySQL server:

```sql
CREATE DATABASE aionic;
```

Afterwards, copy the environment and configuration files and enter your secret information:

```bash
cp .env.example .env
cp .ormconfig.json.example .ormconfig.json
```

Now, run the following commands to install the node modules and start the webserver:

```
yarn install
yarn build
yarn start
```

Last but not least run the following command for SQL data seeding:

```
yarn seed global
```

This should create a dummy admin account and outputs the it's password to the console.

## User Guide

In progress.

## Philosophy

> Our focus is on simplifying and accelerating the workflow of agile teams.

We try to help other teams to realize their ideas by offering highly maintainable software for project management and collaboration.

## Community

- [Author](https://github.com/larswaechter)
- [Website](https://aionic.org)
- [GitHub](https://github.com/aionic-org)
- [Twitter](https://twitter.com/aionic_org)

## License

aionic-core is released under [MIT](https://github.com/aionic-org/aionic-core/blob/master/LICENSE) license.
