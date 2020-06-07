import { run } from './index';
import axios from 'axios';
import config from '../../config';

export const enroll = async t => {
  const token =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  const data = JSON.stringify({
    seed_token: process.env.ENROLL_TOKEN,
    wallet_token: token,
  });

  await axios
    .post(`http://127.0.0.1:${config.port}/api/enroll_token`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    })
    .then(res => {
      t.is(res.status, 200);
    })
    .catch(error => {
      t.fail(error);
    });

  t.log(token);

  t.context.token = token;
};

run('Enroll a token', enroll);
