import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response } from 'express';
import { app } from '../../server';
import config from '../../config';

export default async (req: Request, res: Response) => {
  let data: {
    token: string;
    iat: number;
    exp: number;
  };
  try {
    data = jwt.verify(
      req.headers.authorization.slice('Bearer '.length),
      config.secret,
    ) as {
      token: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    return res.status(403).json({
      error: {
        message: "Couldn't find the token",
      },
    });
  }

  console.log('[rtmp end]: Got the data for ending: ', data);

  const session = app.rtmpSessions[data.token];
  if (!session) {
    return res.status(404).json({
      error: {
        message: "Stream isn't running",
      },
    });
  }

  console.log('[rtmp end]: Got the session for ending: ', session);

  app.rtmpSessions[data.token].reject();

  console.log('[rtmp end]: Rejected the session');

  delete app.rtmpSessions[data.token];

  console.log('[rtmp end]: Removed the session from open sessions');

  return res.status(200).json({ data: { message: 'Removed the session' } });
};
