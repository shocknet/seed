import express from 'express';

export default async (server: express.Express) => {
  server.get('/', async (req, res) => {
    return res.status(200).json({
      data: {
        message: 'Hello World!',
      },
    });
  });
};
