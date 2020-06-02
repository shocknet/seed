import express from 'express';
import actions from './actions';

export default async (server: express.Express) => {
  server.get('/enroll_token', actions.enroll);
};
