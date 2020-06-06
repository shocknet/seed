import { Request, Response, File } from 'express';
import createTorrent from 'create-torrent';
import fs from 'fs';
import parseTorrent from 'parse-torrent';
import { Instance as TorrentInstance } from 'magnet-uri';

import { app } from '../../server';
import { File as FileModel } from '../../models/File';
import { Token } from '../../models/Token';
import { IsBlocked } from '../../models/Blacklist';
import config from '../../config';

export default async (req: Request, res: Response) => {
  // Get model repositories and the uploaded files
  const FileRepository = app.db.getRepository(FileModel);
  const TokenRepository = app.db.getRepository(Token);
  const files = req.files as File[];

  // Create the torrent file by getting first files directory
  // Promise is used here to wait for ".torrent" file creation before adding
  // files to the database.
  let t: TorrentInstance;
  try {
    t = await new Promise((resolve, reject) => {
      createTorrent(
        files[0].destination,
        {
          comment: req.body.comment, // free-form textual comments of the author
          createdBy: process.env.APP_NAME, // name and version of program used to create torrent
          announceList: config.trackers, // custom trackers (array of arrays of strings)
          urlList: [process.env.WEBSEED_URL], // web seed url
          info: req.body.info, // add non-standard info dict entries
        },
        async (err, torrent) => {
          // Remove the files if torrent info-hash is blacklisted
          let t = parseTorrent(torrent);

          if (await IsBlocked(t.infoHash)) {
            fs.rmdirSync(files[0].destination, { recursive: true });
            reject({
              error: {
                message: 'Uploaded files are blacklisted',
              },
            });
            return;
          }

          if (!err) {
            // `torrent` is a Buffer with the contents of the new .torrent file
            fs.writeFileSync(
              files[0].destination + `/${req.token.token}.torrent`,
              torrent,
            );
          }

          resolve(t);
        },
      );
    });
  } catch (error) {
    return res.status(409).json(error);
  }

  // Add the files info to the database
  files.map(async file => {
    let storedFile = await FileRepository.save(
      FileRepository.create({
        ...file,
        hash: t.infoHash,
        token: req.token,
      }),
    );
  });

  // Update the token to used status
  TokenRepository.update(req.token.id, {
    used: true,
  }).then(result => {
    if (result.affected === 0) {
      return res.status(500).json({
        error: {
          message: "Server couldn't update the token status to used",
        },
      });
    }
  });

  return res.status(200).json({
    data: {
      torrent: {
        name: t.name,
        web_seed: process.env.WEBSEED_URL,
        magnet: parseTorrent.toMagnetURI(t),
      },
    },
  });
};
