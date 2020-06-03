import { Request, Response, File } from 'express';
import { app } from '../../server';
import { File as FileModel } from '../../models/File';
import { Token } from '../../models/Token';

export default async (req: Request, res: Response) => {
  const FileRepository = app.db.getRepository(FileModel);
  const TokenRepository = app.db.getRepository(Token);
  const files = req.files as File[];

  files.map(async file => {
    let storedFile = await FileRepository.save(
      FileRepository.create({
        ...file,
        token: req.token,
      }),
    );
  });

  TokenRepository.update(req.token.id, {
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

  return res.status(200).end();
};
