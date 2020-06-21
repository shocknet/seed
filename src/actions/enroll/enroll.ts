import { Request, Response } from 'express';
import { app } from '../../server';
import { Token } from '../../models/Token';

export default async (req: Request, res: Response) => {
  let TokenRepository = app.db.getRepository(Token);

  if (req.body.seed_token !== process.env.ENROLL_TOKEN) {
    return res.status(403).end();
  }

  await TokenRepository.save(
    TokenRepository.create({
      token: req.body.wallet_token,
    }),
  ).catch(() => {
    return res.status(500).end();
  });

  return res.status(200).end();
};
