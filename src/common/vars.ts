import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const SALT_ROUND = parseInt(process.env.SALT_ROUND as string);
export const JWT_SECRET = process.env.JWT_SECRET ?? 's%$&54s(00jhg$#@6';
export const ROOT_PATH = path.join(__dirname, '../..');

/**
 * Can be one of: url, cert
 */
export const CONNECTION_TYPE = process.env.DB_TYPE ?? 'url';
/**
 * MongoDB connection string
 */
export const DB_HOST = process.env.DB_HOST ?? 'mongodb://localhost:27017/auth';
/**
 * MongoDB certificate path
 */
export const DB_CERT = process.env.DB_CERT ?? `${ROOT_PATH}/.secrets/cert.pem`;

export const NODE_ENV = process.env.NODE_ENV ?? 'local';
export const API_PORT = process.env.API_PORT ?? 8000;

export const DB_NAME = process.env.DB_NAME ?? 'test';

export const DB_BACKUP_PATH =
  process.env.DB_BACKUP_PATH ?? '/home/jordan/db-backups/dinoes';

// Default values
export const PER_PAGE = 15;

export const MIN_APP_VERSION = 1.0;

// SMTP variables
export const SMTP_HOST = process.env.SMTP_HOST ?? 'localhost';
export const SMTP_PORT = process.env.SMTP_PORT ?? 1025;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_FROM = process.env.SMTP_FROM ?? 'no-reply@localhost';
