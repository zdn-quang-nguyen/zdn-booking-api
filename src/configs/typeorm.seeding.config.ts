import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './typeorm.config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const seedingConfig = {
  ...config,
  seeds: ['src/database/seeds/**/*.ts'],
  factories: ['src/database/factory/**/*.ts'],
};

module.exports = seedingConfig;
export const connectionSource = new DataSource(
  seedingConfig as DataSourceOptions,
);
