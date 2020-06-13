import ava from 'ava';
import { Server } from 'http';

import { bootstrap } from '../../server';
import config from '../../config';

export const run = ava;

let server: Server;

run.before(async t => {
  await bootstrap()
    .then(app => {
      server = app.server.listen(config.port, () => {
        console.log(`ShockSeed is running on ${config.port}!`);
      });
    })
    .catch(err => console.error("Couldn't start the ShockSeed server:\n", err));
});

run.after(async t => {
  server.close(() => {
    t.log('Closed the server successfully after tests');
  });
});
