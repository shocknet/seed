import NodeMediaServer from 'node-media-server';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import config from '../config';

export const RTMPEventsListen = (nms: NodeMediaServer) => {
  nms.on('preConnect', (id, args) => {
    console.log(
      '[NodeEvent on preConnect]',
      `id=${id} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('postConnect', (id, args) => {
    console.log(
      '[NodeEvent on postConnect]',
      `id=${id} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('doneConnect', (id, args) => {
    console.log(
      '[NodeEvent on doneConnect]',
      `id=${id} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('prePublish', (id, StreamPath, args) => {
    console.log(
      '[NodeEvent on prePlay]',
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );

    if (fs.existsSync(process.env.MEDIA_ROOT + StreamPath)) {
      let session = app.nms.getSession(id);
      return session.reject();
    }

    const data = jwt.verify(args.key, config.secret) as {
      token: string;
      iat: number;
      exp: number;
    };

    app.rtmpSessions[StreamPath.split('/')[2]] = app.nms.getSession(id);

    if (!StreamPath.match(`live\/${data.token}`)) {
      let session = app.nms.getSession(id);
      return session.reject();
    }
  });

  nms.on('postPublish', (id, StreamPath, args) => {
    console.log(
      '[NodeEvent on postPublish]',
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('donePublish', (id, StreamPath, args) => {
    console.log(
      '[NodeEvent on donePublish]',
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('prePlay', (id, StreamPath, args) => {
    console.log(
      '[NodeEvent on prePlay]',
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('postPlay', (id, StreamPath, args) => {
    console.log(
      '[NodeEvent on postPlay]',
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
  });

  nms.on('donePlay', (id, StreamPath, args) => {
    console.log(
      '[NodeEvent on donePlay]',
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
  });
};
