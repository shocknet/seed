import express from 'express';
import actions from './actions';
import config from './config';
import multer from 'multer';
import auth from './middlewares/auth';

let uploader = multer({
  storage: config.storage,
});

export const registerStreamRoutes = async (server: express.Express) => {
  server.post('/api/stream/auth', actions.enrollStream);
  server.get('/api/stream/live/:token', actions.isLiveStream);
  server.get('/api/stream/end', actions.endStream);
  server.get('/api/stream/torrent/:token', actions.streamTorrent);
  server.get('/api/stream/:token/:file', actions.watchStream);
};

export default async (server: express.Express) => {
  registerStreamRoutes(server);
  server.post('/api/enroll_token', actions.enroll);
  server.post('/api/put_file', auth, uploader.array('files'), actions.upload);
  server.get('/api/:hash/info', actions.info);
  server.get('/api/healthz', (req, res) => {
    res.send().status(200);
  });
};
