import Configuration from '../config';

import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import http from 'http';
import setJsonRes from '../lib/setJR';
import { IResponse } from './models/interfaces';
import { mongoConnection } from './mongo';
import { AuthRouter, InventoryRouter } from './routers';
import { parseToken } from './security';

const config = Configuration.instance;
const logger = config.logger;

const startServer = async (): Promise<[http.Server, Express.Application]> => {
  await mongoConnection.startMongoConnection(config.mongoUri, logger);
  mongoConnection.setMongoListeners(logger);

  const app = express();

  app.set('port', config.port);

  app.use(helmet());
  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res, next) => {
    const response: IResponse<{ message: string }> = {
      body: { message: 'Welcome to Inventory API!' },
      status: 200,
    };
    return setJsonRes(res, next, response);
  });

  app.use(parseToken);

  app.use('/api/inventory', new InventoryRouter().router);
  app.use('/api/auth', new AuthRouter().router);

  const server = http.createServer(app);

  server.listen(app.get('port'), () => {
    logger.info(`Server is running on http://localhost:${app.get('port')}`);
  });

  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.response) {
      const status = res.locals.response.status as number;
      const body = res.locals.response.body;
      delete res.locals.response;
      return res.status(status).json({ content: { ...body } });
    }
    next();
  });

  app.use('*', (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      logger.error(err);
      return res.status(500).json({ message: 'Server Error!' });
    }
    next();
  });

  app.use('*', (req: Request, res: Response) => {
    return res.status(404).json({ message: 'Not Found!' });
  });

  return [server, app];
};

export default startServer;
