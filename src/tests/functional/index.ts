import ava, { TestInterface } from 'ava';
import { Server } from 'http';

import { bootstrap } from '../../server';
import config from '../../config';

export const run = ava as TestInterface<{ token: string }>;

let server: Server;

run.before(async t => {
  let app = await bootstrap();
  server = app.server.listen(config.port, () => {
    console.log(`ShockSeed is running on ${config.port}!`);
  });
});

run.after(async t => {
  server.close(() => {
    t.log('Closed the server successfully after tests');
  });
});
