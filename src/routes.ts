import express from 'express';
import actions from './actions';

export default async (server: express.Express) => {
  server.post('/enroll_token', actions.enroll);
};
