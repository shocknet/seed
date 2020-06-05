import express from 'express';
import actions from './actions';
import config from './config';
import multer from 'multer';
import auth from './middlewares/auth';

let uploader = multer({
  storage: config.storage,
});

export default async (server: express.Express) => {
  server.post('/enroll_token', actions.enroll);
  server.post('/put_file', auth, uploader.array('files'), actions.upload);
};
