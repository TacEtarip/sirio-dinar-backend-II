import mongoose from 'mongoose';
import { Logger } from 'pino';

export const startMongoConnection = async (
  mongoURI: string,
  logger: Logger,
) => {
  try {
    mongoose.set('strictQuery', true);
    const connection = await mongoose.connect(mongoURI);
    logger.info('MongoDB connected');
    return connection;
  } catch (error) {
    logger.error(error);
  }
};

export const setMongoListeners = (logger: Logger) => {
  const db = mongoose.connection;

  db.on('connected', logOnConnection(logger));
  db.on('error', logOnError(logger));
  db.on('disconnected', logOnDisconnect(logger));
  process.on('SIGINT', closeConnectionOnSIGINT(logger));
};

export const logOnConnection = (logger: Logger) => {
  return () => {
    logger.info('Mongoose connected to db');
  };
};

export const logOnError = (logger: Logger) => {
  return (err: any) => {
    logger.error(err);
  };
};

export const logOnDisconnect = (logger: Logger) => {
  return () => {
    logger.warn('Mongoose connection is disconnected');
  };
};

export const logOnClose = (logger: Logger) => {
  return () => {
    logger.info(
      'Mongoose default connection is disconnected due to application termination',
    );
    process.exit(0);
  };
};

export const closeConnectionOnSIGINT = (logger: Logger) => {
  return () => {
    const db = mongoose.connection;
    db.close(logOnClose(logger));
  };
};
