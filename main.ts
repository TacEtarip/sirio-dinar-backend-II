import dotenv from 'dotenv';
dotenv.config();

import Configuration from './config';
import startServer from './server';

import throng from 'throng';

const config = Configuration.instance;
const logger = config.logger;

const master = () => {
  logger.warn('Application started');
};

const worker = () => {
  logger.info('Worker started');
  startServer();
};

throng({ master, worker, count: config.workers });
