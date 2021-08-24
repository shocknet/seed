import Websocket from 'ws';
import config from './config';
import { app } from './server';

const viewersRegex = /\(([^)]+)\)/;

export default async (wss: Websocket.Server) => {
  wss.on('connection', function connection(ws, req) {
    let isViewer = false;
    let STREAM_NAME: string;
    if (req.url.includes('/stream/watch')) {
      STREAM_NAME = req.url.replace(/\/stream\/watch\//g, '');
      app.viewers[STREAM_NAME]
        ? app.viewers[STREAM_NAME]++
        : (app.viewers[STREAM_NAME] = 1);
      isViewer = true;
    }
    ws.on('message', function incoming(message) {
      if (message.toString().startsWith('viewers(')) {
        STREAM_NAME = viewersRegex.exec(message.toString())[1];
        ws.send(
          JSON.stringify({
            data: { viewers: app.viewers[STREAM_NAME] },
          }),
        );
        setInterval(() => {
          ws.send(
            JSON.stringify({
              data: { viewers: app.viewers[STREAM_NAME] },
            }),
          );
        }, 5000);
      }
    });

    ws.on('close', () => {
      if (isViewer) {
        app.viewers[STREAM_NAME]--;
      }
    });

    ws.send(
      JSON.stringify({ data: { message: 'Welcome to ShockStream Websocket' } }),
    );
  });
};
