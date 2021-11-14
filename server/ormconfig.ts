import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

import { Meteo } from './src/entities';

dotenv.config();

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Meteo],
  migrations: ['src/migrations/*.ts'],
};

export default ormConfig;
