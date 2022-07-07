# Client React Native App @ Yenbek

## Pre-requisites

Install following packages globally 

`sudo npm i -g yarn `

`sudo npm install -g expo-cli`

`npm install -g yarn`

`sudo npm install -g eas-cli`

Login with your EAS account: `eas login`

## Installation

In the /client directory run: `npm install`

## Building 

`eas build -p android --profile local` for android and `eas build -p ios --profile local` for iOS.

## Run

`npm start`

Press `w` to open a browser tab for the react-native project

Make sure API server is up and running, checkout /rest/README.md

## Running with local IP address of the machine

`REAL_DEVICE_LOCAl_IP=192.x.x.x npm start`

## Overview

* /constants - is a folder where presumably all permanent data which won't change is saved like API keys, static urls, configs and others. 
* /api - contains API methods to communicate with Rest API
* /components, /navigation, /screens, /hoooks - are all UI related folders
* /stores - contains singleton store classes bridging UI components and API requests. Stores keep essential data for UI components like authentication state for example. They utilize MobX approach, so that whenever anything changes in `@observable` object, all subscribed UI components would react. UI components become "reactive" after they have been wrapped with `observer` function.

## Firebase

For the authentication methods we are utilizing Firebase API. Firebase is used both in the client/backend code.

For more info, see https://firebase.google.com/docs/auth/admin/verify-id-tokens.

## Sentry and Error Handling

Whenever there is an uncaught exception in the application, it automatically gets transmitted to Sentry API service which helps developers to analyze errors in a very efficient way. So, this will help us to understand and prevent any corner cases in our code in the future. Also, as a general rule, it is better to get all errors caught and handled appropriately.

## For Developers

Try to fix ESLint & TS errors wherever it is possible.