import { Request, Response } from 'express';
import { app } from '../server';
import { Token } from '../models/Token';

export default async (req: Request, res: Response, next) => {
  let TokenRepository = app.db.getRepository(Token);

  const token = (await TokenRepository.findOne({
    where: {
      token: req.headers.authorization.slice('Bearer '.length),
    },
  }).catch(() => {
    return res.status(403).json({
      error: {
        message: "Couldn't find the provided token",
      },
    });
  })) as Token;

  if (token.used) {
    return res.status(403).json({
      error: {
        message: 'The provided token has already been used',
      },
    });
  }

  req.token = token as Token;

  next();
};
