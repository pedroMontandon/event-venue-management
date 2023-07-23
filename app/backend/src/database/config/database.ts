import { Options } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();



const config: Options = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: 'EVENT_VENUE_MANAGEMENT',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Z',
  },
  logging: false,
}

// export default config;
export = config;