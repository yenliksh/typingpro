# Rest API Server @ Yenbek

## Installation
In the /rest directory run: `npm install`

Also install `npm install -g ts-node` globally

## Run

`npm start`

## Overview

* /controllers - contains API routes
* /models - contains classes that define database table structures

For the database related operations, Sequelize ORM is being used.

## Firebase

For the authentication methods we are utilizing Firebase API. Firebase is used both in the client/backend code.

For more info, see https://firebase.google.com/docs/auth/admin/verify-id-tokens.

## Deployment to AWS Elastic BeansTalk

Upload .zip from Github repository and rest folder

`aws elasticbeanstalk update-environment --environment-name=Stagingyenbekrest-env --option-settings=file://env-staging.json`