import Configuration from '../config';

import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { mongoConnection } from './mongo';
import { AuthRouter, InventoryRouter } from './routers';
import { parseToken } from './security';

const app = express();

const config = Configuration.instance;
const logger = config.logger;

const startServer = async (): Promise<[http.Server, Express.Application]> => {
  await mongoConnection.startMongoConnection(config.mongoUri, logger);
  mongoConnection.setMongoListeners(logger);

  app.set('port', config.port);

  app.use(helmet());
  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    return res.send('Welcome to sirio dinar backend!');
  });

  app.use(parseToken);

  app.use('/api/inventory', new InventoryRouter().router);
  app.use('/api/auth', new AuthRouter().router);

  const server = http.createServer(app);

  server.listen(app.get('port'), () => {
    logger.info(`Server is running on http://localhost:${app.get('port')}`);
  });

  return [server, app];
};

export default startServer;
