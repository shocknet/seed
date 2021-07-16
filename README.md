# Shock Seed

---

A simple cross platform NodeJS service that lets your users upload files to torrent and also
share live streams using RTMP or RTSP and supports different output formats including
HLS/DASH/MP4/H.264/H.265/AAC/OPUS

Table of Content:

- [Installation](#installation)
  - [Docker Container](#docker-container)
- [Configuration](#configuration)
- [Tests](#tests)
  - [Tests Configuration](#tests-configuration)
  - [Run Tests](#run-tests)
- [Routes](#routes)
  - [Enroll token](#enroll-token)
  - [Upload files](#upload-files)
  - [Files info](#files-info)
- [Streaming](#streaming)
  - [Publish Stream using FFMPEG](#publish-stream-using-ffmpeg)
  - [Publish Stream using OBS](#publish-stream-using-obs)
  - [Fetching Live Stream](#fetching-live-stream)

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

### Tests Configuration

Tests are located under the `src/tests` directory and they use the `.env.test` file for fetching the configuration. Test configuration keys are same as the main `.env.example` file but keep in mind, if you don't provide a `.env.test` file, `.env` would be used instead.

### Run Tests

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

## Streaming

Streams are published to the server through the RTMP protocol, so you can use
either OBS, ffmpeg or other tools to push your stream to the server.

### Publish Stream using FFMPEG

For a H.264 video and AAC audio use:

```
ffmpeg -re -i FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME
```

For other audio or video formats use:

```
ffmpeg -re -i FILE_NAME -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/STREAM_NAME
```

### Publish Stream using OBS

Using the **Settings** menu open the **Stream** tab and fill the values according
to your config. Like:

Stream Type: Custom Streaming Server

URL: rtmp://localhost/live

Stream key: STREAM_NAME

### Fetching Live Stream

There are different formats that you can use to fetch the stream output. Here
is a list of available URLs:

HLS
`http://localhost:8000/live/STREAM/index.m3u8`

DASH
`http://localhost:8000/live/STREAM/index.mpd`

RTMP
`rtmp://localhost/live/STREAM`

http-flv
`http://localhost:8000/live/STREAM.flv`

websocket-flv
`ws://localhost:8000/live/STREAM.flv`
