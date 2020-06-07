import { Request, Response } from 'express';
import parseTorrent from 'parse-torrent';
import fs from 'fs';
import path from 'path';
import { app } from '../../server';
import { File } from '../../models/File';

export default async (req: Request, res: Response) => {
  let FileRepository = app.db.getRepository(File);

  const files = (await FileRepository.find({
    where: { hash: req.params.hash },
  }).catch(() => {
    return res.status(404).json({
      error: {
        message: "Couldn't find any files using the provided hash",
      },
    });
  })) as File[];

  const magnet = parseTorrent.toMagnetURI(
    parseTorrent(
      fs.readFileSync(
        path.join(
          files[0].destination,
          files[0].destination.split('/').slice(-1)[0] + '.torrent',
        ),
      ),
    ),
  );

  return res.status(200).json({
    data: {
      files,
      magnet,
    },
  });
};
