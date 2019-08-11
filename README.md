# Aionic Core

![alt text](https://avatars0.githubusercontent.com/u/42389304?s=100&v=4 'Aionic Logo')

Aionic offers open source applications for project management and collaboration. Our focus is on simplifying and accelerating the workflow for agile teams in the open source way.

## Description

Aionic offers a set of **open source products** for project management of any size. All our products are released under the [MIT](https://opensource.org/licenses/MIT) license, so feel free to customize it and share it with others!

Please keep in mind that we just develop the software and don't host the applications anywhere for public usage. That means you have to take care of the hosting for yourself.

All products are built on top of the **Aionic Core** application, since this is the place where all your data is managed and distributed. So for the usage of any other application, you have to use at least [Aionic Core](https://github.com/Aionic-Apps/aionic-core/).

Some of the technologies we trust: _Node.js, React, MySQL_

## Features

**Aionic Core** is the foundation for any other of our applications, since it's the place to store and distribute all the data you create. The application is a REST API written in Typescript and based on an Express.js HTTP server.

Some of the features included in this app:

- REST API
- Mail Service
- MySQL ORM
- GitHub API integration
- Caching
- Permission control via ACL
- Authentication via JWT or BasicAuth

## Prerequisites

- Node.js
- SMTP server (for sending mails)
- MySQL database

## Installation

First of all, create a new database on your MySQL server:

```sql
CREATE DATABASE aionic;
```

Afterwards, rename the following files and enter your credentials / infos:

- .env.example -> .env
- .ormconfig.json.example -> .ormconfig.json

Now, run the following commands to start the application in production mode

```
yarn install
yarn build
yarn start
```

Last but not least run the following command for SQL data seeding:

```
yarn run seed
```

NOTE: You can also use [npm](https://www.npmjs.com/).

## User Guide

In progress.

## Philosophy

> Our focus is on simplifying and accelerating the workflow for agile teams in the open source way.

We try to help other people and companies realizing their ideas by offering highly maintainable project management softwares that everybody can **adjust as desired**.

## Community

- [Author](https://github.com/larswaechter)
- [Website](https://aionic-apps.com)
- [GitHub](https://github.com/Aionic-Apps)
- [Twitter](https://twitter.com/AionicApps)

## License

Aionic Core is released under [MIT](https://github.com/Aionic-Apps/aionic-core/blob/master/LICENSE) license.
