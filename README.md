# Shock Seed

---

Simple webtorrent seed service.

## Installation

---

1. Clone and install:

```bash
$ git clone git@github.com:shocknet/seed.git
$ cd seed
$ mv env.example .env
$ yarn install
```
2. Required configuration variables are specified in the example file.

```bash
$ nano .env
```

3. Run the server by using the `start` script:

```bash
$ yarn start
```

### Docker Container

There's a `Dockerfile` available at the root of the project which you can use to build an image and run the server inside a isolated container.

```bash
$ docker build -t shocknet/seed:v0.0.1 .
```

## Configuration

---

1. **WebTorrent Trackers:**  
   The `TRACKERS` environment variable can be used to specify custom web torrent trackers for the generated `.torrent` files.  
    **Format:** An array of arrays of strings. More information available at [bep12](http://www.bittorrent.org/beps/bep_0012.html)  
    **Default Value:** see `bittorrent-tracker`

2. **WebSeed URLs:**  
   The `WEBSEED_URL` environment variable can be used to specefiy an array of URIs for `.torrent` files' webseed.  
   **Format:** An array of strings. More information available at [bep19](http://www.bittorrent.org/beps/bep_0019.html)

3. **Database:**  
   This projects supports both `sqlite` and `postgres` databases. Database configuration fields are available in `.env.example` file.  
   **Default:** `sqlite` is the default database and its file is located on projects root by default. Default value for `SQLITE_DB` is `PROJECT_ROOT/database.sqlite`.

4. **File Storage:**  
   Currently only storing files on the local storage is available. The provided keys for configruing file storage are `STORAGE_TYPE` and `STORAGE_PATH`.  
   **Default:**  
   `STORAGE_TYPE` = `local`  
   `STORAGE_PATH` = `/tmp/seed-uploads`

## Tests

---

### Configuration

Tests are located under the `src/tests` directory and they use the `.env.test` file for fetching the configuration. Test configuration keys are same as the main `.env.example` file but keep in mind, if you don't provide a `.env.test` file, `.env` would be used instead.

### Run

This projects uses [Avajs](https://avajs.dev) for running the test and you can use the `test` script to run the tests via `ava`:

```bash
$ yarn test
```

## Routes

---

### Enroll token

Method: `POST`
Endpoint: `/api/enroll_token`
Required Headers:

```
Content-Type: application/json
```

Body:

```json
{
  "seed_token": "Should match ENROLL_TOKEN env",
  "wallet_token": "Token purchased by user"
}
```

---

### Upload files

Method: `POST`
Endpoint: `/api/put_file`
Required Headers:

```
Content-Type: application/json
Authorization: `Bearer {Enrolled token}`
```

Body:
File upload uses multipart format and files should use the `files` key in request.
Additional data:

```json
{
  "comment": ".torrent file comment",
  "info": {
    "additional": "Use object-like format for additional info for .torrent file"
  }
}
```

---

### Files info

Endpoint: `/api/{HASH}/info`
Required Headers:

```
Null
```

Request Params:

`{HASH}`: Provided in the response of file upload request.
