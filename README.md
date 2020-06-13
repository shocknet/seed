# seed

Simple webtorrent seed service using TypeScript and Express.

## Installation

1. Clone the repo using the command below:

```bash
$ git clone git@github.com:shocknet/seed.git
```

2. Go to the cloned repository's directory and install the dependencies using [Yarn](https://yarnpkg.com):

```bash
$ yarn
```

3. Make a copy of the `.env.example` file and name it `.env`. Required configuration variables are specefied with comment inside the example file.

4. Now that configuration and dependencies are ready, you can run the server by using the `start` script:

```bash
$ yarn start
```

### Docker Container

There's a `Dockerfile` available at the root of the project which you can use to build an image and run the server inside a isolated container.

```bash
$ docker build -t shocknet/seed:v0.0.1 .
```

## Tests

### Configuration

Tests are located under the `src/tests` directory and they use the `.env.test` file for fetching the configuration. Test configuration keys are same as the main `.env.example` file but keep in mind, if you don't provide a `.env.test` file, `.env` would be used instead.

### Run

This projects uses [Avajs](https://avajs.dev) for running the test and you can use the `test` script to run the tests via `ava`:

```bash
$ yarn test
```
