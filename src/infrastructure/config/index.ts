import path from 'path';

import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../../.env')});

export const config = {
    botToken: process.env.BOT_TOKEN || '',
    adminHexCode: process.env.ADMIN_HEX_CODE || '',
    databaseUrl: process.env.DATABASE_URL || '',
};

if ( !config.botToken) {
    throw new Error('BOT_TOKEN is not defined in .env file');
  }

if (!config.adminHexCode) {
    throw new Error('ADMIN_HEX_CODE is not defined in .env file');
}
