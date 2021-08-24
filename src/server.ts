import express from 'express';
import { createConnection, Connection } from 'typeorm';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import NodeMediaServer from 'node-media-server';
import setupWebSocket from './websockets';
import { createServer, Server as HTTPServer } from 'http';
import ws from 'ws';

import registerRoutes from './routes';
import config from './config';
import { RTMPEventsListen } from './stream';

export const app: {
  db: Connection;
  server: express.Express;
  nms: NodeMediaServer;
  rtmpSessions: {
    [key: string]: any;
  };
  viewers: {
    [key: string]: number;
  };
  wssServer: HTTPServer;
  wss: ws.Server;
} = {
  db: null,
  server: null,
  nms: null,
  rtmpSessions: {},
  viewers: {},
  wssServer: null,
  wss: null,
};

export const bootstrap = async () => {
  app.server = express();

  app.db = await createConnection(config.db);

  await app.db.runMigrations();

  app.server.use(bodyParser.json());
  app.server.use(morgan('combined'));

  registerRoutes(app.server);

  // Setup simple Websockets (non-socketio)
  app.wssServer = createServer();
  app.wss = new ws.Server({ server: app.wssServer });
  setupWebSocket(app.wss);

  app.nms = new NodeMediaServer({
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      mediaroot: process.env.MEDIA_ROOT,
      allow_origin: '*',
    },
    trans: {
      ffmpeg: process.env.FFMPEG_PATH,
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          dash: true,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
          mp4: true,
          mp4Flags: '[movflags=frag_keyframe+empty_moov]',
        },
      ],
    },
  });

  RTMPEventsListen(app.nms);

  return app;
};
