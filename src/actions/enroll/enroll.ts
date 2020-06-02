import { Request, Response } from 'express';

const UserAgentRegex = /(ShockWallet)\sv(([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?)/;

export default async (req: Request, res: Response) => {
  let matches = await req.headers['user-agent'].match(UserAgentRegex);
  // TODO: Compare the version to the GitHub tags
  if (matches === null || matches[1] !== 'ShockWallet') {
    return res.status(403).end();
  }
  return res.status(200).end();
};
