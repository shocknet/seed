import { Request, Response } from 'express';
import config from '../../config';
import jwt from 'jsonwebtoken';

import { app } from '../../server';
import { Token } from '../../models/Token';

export default async (req: Request, res: Response) => {
  const TokenRepository = app.db.getRepository(Token);

  if (!req.body.token) {
    return res.status(403).json({
      error: {
        message: "Couldn't find the token",
      },
    });
  }

  const expires = (
    new Date().setMonth(new Date().getMonth() + 1) / 1000
  ).toFixed();

  const token = jwt.sign({ token: req.body.token }, config.secret, {
    expiresIn: '31d',
  });

  TokenRepository.findOne({ where: { token: req.body.token } }).then(
    tokenModel => {
      TokenRepository.update(tokenModel.id, {
        used: true,
      }).then(result => {
        if (result.affected === 0) {
          return res.status(500).json({
            error: {
              message: "Server couldn't update the token status to used",
            },
          });
        }
      });
    },
  );

  return res.status(201).json({
    data: {
      token,
      url: `${config.rtmp}/live/${req.body.token}?key=${token}`,
    },
  });
};
