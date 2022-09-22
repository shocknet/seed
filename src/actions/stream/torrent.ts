import { Request, Response } from 'express';
import fs from 'fs';
import createTorrent from 'create-torrent';
import parseTorrent from 'parse-torrent';
import { Instance as TorrentInstance } from 'magnet-uri';
import fetch from 'node-fetch';

import { app } from '../../server';
import { File as FileModel } from '../../models/File';
import { Token } from '../../models/Token';
import config from '../../config';
import { IsBlocked } from '../../models/Blacklist';

export default async (req: Request, res: Response) => {
  const FileRepository = app.db.getRepository(FileModel);
  const TokenRepository = app.db.getRepository(Token);

  if (!req.params.token) {
    return res.status(400).json({
      error: {
        message: 'Provide a stream token stream',
      },
    });
  }

  const StreamPath = process.env.MEDIA_ROOT + '/live/' + req.params.token;
  if (!fs.existsSync(StreamPath)) {
    return res.status(404).json({
      error: {
        message: "Stream doesn't exist",
      },
    });
  }

  let torrentFile = await FileRepository.findOne({
    where: {
      token: await TokenRepository.findOne({
        where: { token: req.params.token },
      }),
    },
  });

  // Upload the mp4 and torrent file
  if (!torrentFile) {
    await new Promise((res, rej) => {
      setTimeout(async () => {
        fs.readdirSync(StreamPath).forEach(async fileName => {
          if (!fileName.endsWith('.mp4')) {
            return;
          }

          // Create the torrent file by getting first files directory
          // Promise is used here to wait for ".torrent" file creation before adding
          // files to the database.
          let t: TorrentInstance;
          try {
            t = await new Promise((resolve, reject) => {
              createTorrent(
                StreamPath,
                {
                  name: req.params.token,
                  createdBy: process.env.APP_NAME, // name and version of program used to create torrent
                  announceList: config.trackers, // custom trackers (array of arrays of strings)
                  urlList: [
                    `${process.env.WEBSEED_URL}/streams/${req.params.token}/${fileName}`,
                  ],
                },
                async (err, torrent) => {
                  // Remove the files if torrent info-hash is blacklisted
                  let t = parseTorrent(torrent);

                  if (await IsBlocked(t.infoHash)) {
                    fs.rmdirSync(StreamPath, { recursive: true });
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
                      StreamPath + `/${req.params.token}.torrent`,
                      torrent,
                    );
                  }

                  // Append the .torrent file URI to the magnet
                  t.xs = `${process.env.WEBSEED_URL}/streams/${req.params.token}/${req.params.token}.torrent`;
                  resolve(t);
                },
              );
            });
          } catch (error) {
            console.error(error);
          }

          const file = fs.statSync(StreamPath + '/' + fileName);

          // Add the files info to the database
          torrentFile = await FileRepository.save(
            FileRepository.create({
              originalname: fileName,
              encoding: 'mp4',
              mimetype: 'mp4',
              size: file.size,
              destination: StreamPath + '/' + fileName,
              filename: fileName,
              path: StreamPath,
              hash: t.infoHash,
              magnet: parseTorrent.toMagnetURI(t),
              token: await TokenRepository.findOne({
                where: { token: req.params.token },
              }),
            }),
          );
          res(true);
        });
      }, 3000);
    });
  }

  let magnet;
  try {
    magnet = torrentFile.magnet;
  } catch (error) {
    return res.status(404).json({
      error: {
        message: "Stream doesn't exist in database",
      },
    });
  }

  return res.json({
    magnet,
    filename: torrentFile.filename,
    web_seed: process.env.WEBSEED_URL
  });
};
