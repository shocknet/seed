import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export type Config = {
  port: number;
  db: ConnectionOptions;
};

export default {
  port: process.env.PORT || 3000,
  db: ParseDatabase(),
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
