import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { TYPE_ORM_CONFIG } from 'src/constants/constants';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

export const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: process.env.DATABASE_SYNC === 'true',
  logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
};

export default registerAs(TYPE_ORM_CONFIG, () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
