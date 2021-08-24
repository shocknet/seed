import { time } from 'console';
import { Request, Response } from 'express';
import fs from 'fs';
import { app } from '../../server';

export default async (req: Request, res: Response) => {
  if (!req.params.token) {
    return res.status(400).json({
      error: {
        message: 'Provide a stream token stream',
      },
    });
  }

  const streamPath = process.env.MEDIA_ROOT + '/live/' + req.params.token;
  if (!fs.existsSync(streamPath)) {
    return res.status(404).json({
      error: {
        message: "Stream doesn't exist",
      },
    });
  }

  const file = fs.createReadStream(streamPath + '/' + req.params.file);

  return file.pipe(res);
};
