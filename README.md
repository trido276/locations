<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# TypeScript Backend: Crafting a Database with Ease

TypeScript backend project \
Handle database design, specifically to support an **Address Location Tree** using Postgres.

![alt text](image.png)

## Location Structure

Structure of a Location:

- **ID**: Automatically generated
- **Location Name**: Simple and straightforward
- **Short Name**: A quick identifier for parent paths
- **Location Number**: Clearly maps the path from its parent
- **Area**: Provides the size of each location
- **Parent**: Links locations to their respective parent using IDs

## Key Features

- **Functions**: Handles request validation, exception management, logging, clean code, and documentation.

## To-do list

- **Logical Relationships**: Connects children to parents and ensures each sibling has a unique ShortName.
- **Handle Update of Child Location Numbers when Parent is Updated**: when a parent location is updated, all child locationNumber are adjusted.
- **Update Child Locations when Removing a Parent**: When removing a parent location, ensure that child locations are reassigned to the parent's parent (if available) and update their LocationName.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Request

### Create Parent
#### Request
```bash
curl --location --request POST 'http://localhost:3000/locations' \
--header {
    'Content-Type: application/json',
    } \
--data-raw {
  "locationName": "A",
  "locationShortName": "A",
  "area": 0
}
```

#### Response
```json
{
  "locationName": "A",
  "locationShortName": "A",
  "locationNumber": "A",
  "area": 0,
  "id": "78d01223-a2e4-4ea4-bb87-a869d0bdc5df"
}
```

### Create Child
#### Request
```bash
curl --location --request POST 'http://localhost:3000/locations' \
--header {
    'Content-Type: application/json',
  } \
--data-raw {
  "locationName": "Car Park2",
  "locationShortName": "CarPark",
  "area": 80620,
  "parent": {
    "id": "78d01223-a2e4-4ea4-bb87-a869d0bdc5df"
  }
}
```

#### Response
```json
{
  "locationName": "Car Park2",
  "locationShortName": "CarPark",
  "locationNumber": "A - CarPark",
  "area": 80620,
  "parent":{
    "id": "78d01223-a2e4-4ea4-bb87-a869d0bdc5df"
  },
  "id": "37770fc5-7d6f-4ec4-97a4-591677a05fc3"
}
```
##
### Get
#### Get all
```bash
curl --location --request GET 'http://localhost:3000/locations' \
--header {
  'Content-Type: application/json',
  } \
}
```

#### Response
```json
[
  {
    "id": "78d01223-a2e4-4ea4-bb87-a869d0bdc5df",
    "locationName": "A",
    "locationShortName": "A",
    "locationNumber": "A",
    "area": 0
  },
  {
    "id": "a2e7f019-ac8b-4b55-857e-2e18c2757e91",
    "locationName": "Car Park",
    "locationShortName": "CarPark",
    "locationNumber": "A - CarPark",
    "area": 80620
  }
]
```

#### Get by ID
```bash
curl --location --request GET 'http://localhost:3000/locations/a2e7f019-ac8b-4b55-857e-2e18c2757e91' \
--header {
  'Content-Type: application/json',
  } \
}
```

#### Response
```json
{
  "id": "a2e7f019-ac8b-4b55-857e-2e18c2757e91",
  "locationName": "Car Park",
  "locationShortName": "CarPark",
  "locationNumber": "A - CarPark",
  "area": 80620
}
```
##
### Update
#### Request
```bash
curl --location --request PATCH 'http://localhost:3000/locations/a2e7f019-ac8b-4b55-857e-2e18c2757e91' \
--header {
  'Content-Type: application/json',
  } \
--data-raw {
  "locationName": "Car Park3",
  "locationShortName": "CarPark",
  "locationNumber": "A - CarPark",
  "area": 80620
}
```

#### Response
```json
{
  "locationName": "Car Park3",
  "locationShortName": "CarPark",
  "locationNumber": "A - CarPark",
  "area": 80620
}
```
##
### Delete
#### Request
```bash
curl --location --request DELETE 'http://localhost:3000/locations/a2e7f019-ac8b-4b55-857e-2e18c2757e91' \
--header {
  'Content-Type: application/json',
  } \
```

#### Response
```json
200 OK
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
