import axios from 'axios';
import FormData from 'form-data';

import config from '../../config';
import { run } from './index';

run('Enroll a token, upload files and check their info and hash', async t => {
  // Generate and enroll a token
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

  // Generate and upload files using the enrolled token
  let form = new FormData();

  form.append('files', JSON.stringify({ data: 'Data' }), 'data.json');

  form.append('files', JSON.stringify({ test: 'Testing' }), 'testing.json');

  form.append('comment', '.torrent file comment');

  let uploadRes;
  await axios
    .post(`http://127.0.0.1:${config.port}/api/put_file`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      uploadRes = res.data;
      t.is(res.status, 200);
    })
    .catch(error => {
      t.fail(error);
    });

  // Check the uploaded files' info
  await axios
    .get(
      `http://127.0.0.1:${config.port}/api/${uploadRes.data.torrent.hash}/info`,
    )
    .then(res => {
      t.is(res.data.data.magnet, uploadRes.data.torrent.magnet);
      t.is(res.status, 200);
    })
    .catch(error => {
      t.fail(error);
    });
});
