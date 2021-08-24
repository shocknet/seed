import { ConnectionOptions, Db } from 'typeorm';
import * as dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

dotenv.config({
  path:
    process.env.ENVIRONMENT === 'testing'
      ? __dirname + '/../.env.test'
      : __dirname + '/../.env',
});

export type Config = {
  trackers: String[][];
  port: number;
  db: ConnectionOptions;
  secret: string;
  rtmp: string;
  rtmpAPI: string;
  storage: multer.StorageEngine;
};

export default {
  trackers: ParseTrackers(),
  port: process.env.PORT || 3000,
  db: ParseDatabase(),
  storage: CheckStorage(),
  secret: process.env.SECRET || 'unsafe_secret',
  rtmp: process.env.RTMP_SERVER || 'rtmp://127.0.0.1:1935',
  rtmpAPI: process.env.RTMP_API || 'http://localhost:8000/admin',
} as Config;

// ParseDatabase generates a database connection using environment variables,
// and based on the database type
function ParseDatabase() {
  switch (process.env.DB_TYPE) {
    case 'postgres':
      return {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        username: process.env.POSTGRES_USERNAME || 'shockseed',
        password: process.env.POSTGRES_PASSWORD || 'shockseed',
        database: process.env.POSTGRES_DB || 'shockseed',
        entities: [__dirname + '/models/*.ts'],
        synchronize: true,
      };
    default:
      return {
        type: 'sqlite',
        database: process.env.SQLITE_DB || [__dirname + '/../database.sqlite'],
        entities: [__dirname + '/models/*.ts'],
        synchronize: true,
      } as ConnectionOptions;
  }
}

// CheckStorage checks the given storage type, to decide which
// storage engine to use for multer.
function CheckStorage() {
  switch (process.env.STORAGE_TYPE) {
    case 'cdn':
    // TODO: Implement CDN support
    default:
      return multer.diskStorage({
        destination: function(req, file, cb) {
          // Generate separate directories on storage path for each request
          const path =
            (process.env.STORAGE_PATH || `/tmp/seed-uploads`) +
            `/${req.token.token}`;

          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }

          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      });
  }
}

function ParseTrackers() {
  try {
    return JSON.parse(process.env.TRACKERS);
  } catch {
    console.log(
      "Couldn't parse the custom trackers. Using the default trackers...",
    );
  }
}
