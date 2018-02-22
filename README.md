## Install

run `npm install`.

## Development server

You may need to run:

`npm install -g typings`

`npm install -g @angular/cli`

`typings install`

Run `npm start` for a dev server. Navigate to `http://localhost:3000/`.

## Build

You may need:

`npm install -g forever`

Run `sudo PORT=80 npm run-script build` to build the project.

To stop:

`sudo forever stop ./bin/www`

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
