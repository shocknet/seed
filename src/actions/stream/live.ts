import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { app } from '../../server';

import config from '../../config';

export default async (req: Request, res: Response) => {
  if (!req.params.token) {
    return res.status(403).json({
      error: {
        message: "Couldn't find the token",
      },
    });
  }

  // Get the streams list from RTMP server
  let body;
  try {
    const resp = await fetch(`${config.rtmpAPI}/api/streams`, {
      method: 'GET',
    });
    console.log(resp.text);

    body = await resp.json();
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      error: {
        message: "Couldn't list the streams",
      },
    });
  }

  // Check if there's any stream
  if (!body.live) {
    return res.status(404).json({
      error: {
        message: "Couldn't find any streams",
      },
    });
  }

  // Find the requested stream
  let stream;
  Object.keys(body.live).forEach(name => {
    if (req.params.token === name) {
      stream = body.live[name];
    }
  });

  // Check if stream exists
  if (!stream) {
    return res.status(404).json({
      error: {
        message: "Couldn't find the stream",
      },
    });
  }

  return res.status(200).json({
    data: {
      viewers: app.viewers[req.params.token]
        ? app.viewers[req.params.token]
        : 0,
      from: stream.publisher.connectCreated,
      ip: stream.publisher.ip,
      name: stream.publisher.stream,
      status: stream.publisher.app,
      video: stream.publisher.video,
      audio: stream.publisher.audio,
      url: `${config.rtmpAPI}/live/${stream.publisher.stream}`,
    },
  });
};
