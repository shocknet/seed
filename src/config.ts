import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';

dotenv.config();

export type Config = {
  port: number;
  db: ConnectionOptions;
  storage: multer.StorageEngine;
};

export default {
  port: process.env.PORT || 3000,
  db: ParseDatabase(),
  storage: CheckStorage(),
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

          // Create the directory if it doesn't exist
          fs.exists(path, exist => {
            if (!exist) {
              return fs.mkdir(path, error => {
                cb(null, path);
              });
            }
          });

          cb(null, path);
        },
      });
  }
}
