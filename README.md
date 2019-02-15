# Aionic (Core)

![alt text](https://avatars0.githubusercontent.com/u/42389304?s=100&v=4 'Aionic Logo')

Aionic offers open source applications for project management. Our focus is on simplifying the project management process for agile teams in an open way.

## Description

Aionic offers a range of **open source products** for the management of projects of any size. We offer the software but you have to host it on your own servers or cloud. Our products are open source, so everybody can customize them as desired and contribute to them.

All services are built on top of the **Aionic Core** application, since this is the place where all the data is managed. So for the usage of any other service, you have to use at least [Aionice Core](https://github.com/Aionic-App/aionic-core/).

Some of the technologies we trust: _NodeJS, ReactJS, MySQL_

## Features

**Aionic Core** is the foundation for any other of our services. It's the place to store and manage all the data you create. The application is written in Typescript and is based on an ExpressJS HTTP server.

Some of the features this service offers:

- REST API
- Task Service
- Mail Service
- MySQL ORM
- GitHub API integration
- Caching
- Permission control via ACL
- Authentication via JWT or BasicAuth

## Prerequisites

- Hosting server (incl. SMTP for sending mails)
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
yarn start
```

Last but not least run the following command for SQL data seeding:

```
yarn run seed
```

NOTE: You can also use [npm](https://www.npmjs.com/).

## Philosophy

> Our focus is on simplifying the project management process for agile teams in an open way.

We try to help other people / companies realizing their ideas by offering highly maintainable project management softwares that everybody can **adjust as desired**.

## Community

- [Website](https://aionic.app)
- [GitHub](https://github.com/Aionic-Apps)

## License

[MIT](https://github.com/Aionic-Apps/aionic-core/blob/master/LICENSE)
