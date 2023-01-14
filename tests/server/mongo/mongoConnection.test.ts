import mongoose from 'mongoose';
import { Logger } from 'pino';
import { mongoConnection } from '../../../server/mongo';

describe('startMongoConnection', () => {
  let mongoURI: string;
  let logger: Logger;
  beforeEach(() => {
    mongoURI = 'mongodb://localhost/test';
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB', async () => {
    jest.spyOn(mongoose, 'connect').mockImplementationOnce(() => {
      return {} as any;
    });

    jest.spyOn(mongoose, 'set').mockImplementationOnce(() => {
      return {} as any;
    });

    await mongoConnection.startMongoConnection(mongoURI, logger);
    expect(mongoose.connect).toHaveBeenCalledWith(mongoURI);
    expect(mongoose.set).toHaveBeenCalledWith('strictQuery', true);
    expect(logger.info).toHaveBeenCalledWith('MongoDB connected');
  });

  it('should handle MongoDB connection error', async () => {
    const error = new Error('MongoDB connection error');
    jest.spyOn(mongoose, 'connect').mockImplementationOnce(() => {
      throw error;
    });
    await mongoConnection.startMongoConnection(mongoURI, logger);
    expect(logger.error).toHaveBeenCalledWith(error);
  });
});

describe('setMongoListeners', () => {
  let logger: Logger;
  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as any as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set MongoDB event listeners', () => {
    const db = {
      on: jest.fn(),
      close: jest.fn(),
    } as any as mongoose.Connection;

    jest.spyOn(mongoose, 'connection', 'get').mockReturnValue(db);

    jest.spyOn(process, 'on').mockImplementationOnce((_event, callback) => {
      callback();
      return process;
    });

    mongoConnection.setMongoListeners(logger);

    expect(db.on).toHaveBeenCalledWith('connected', expect.any(Function));
    expect(db.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(db.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
  });
});

describe('logOnConnection', () => {
  let logger: Logger;
  beforeEach(() => {
    logger = {
      info: jest.fn(),
    } as any as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log when Mongoose is connected', () => {
    const logOnConnect = mongoConnection.logOnConnection(logger);
    logOnConnect();
    expect(logger.info).toHaveBeenCalledWith('Mongoose connected to db');
  });
});

describe('logOnError', () => {
  let logger: Logger;
  beforeEach(() => {
    logger = {
      error: jest.fn(),
    } as any as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log when there is an error', () => {
    const error = new Error('Test error');
    const logOnErrorCallback = mongoConnection.logOnError(logger);
    logOnErrorCallback(error);
    expect(logger.error).toHaveBeenCalledWith(error);
  });
});

describe('logOnDisconnect', () => {
  let logger: Logger;
  beforeEach(() => {
    logger = {
      warn: jest.fn(),
    } as any as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log when Mongoose is disconnected', () => {
    const logOnDisconnectCallback = mongoConnection.logOnDisconnect(logger);
    logOnDisconnectCallback();
    expect(logger.warn).toHaveBeenCalledWith(
      'Mongoose connection is disconnected',
    );
  });
});

describe('closeConnectionOnSIGINT', () => {
  let logger: Logger;
  let db: any;
  beforeEach(() => {
    logger = {
      info: jest.fn(),
    } as any as Logger;
    db = {
      close: jest.fn(),
    };
    jest.spyOn(mongoose, 'connection', 'get').mockReturnValue(db);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should close Mongoose connection and exit process on SIGINT', () => {
    const closeConnection = mongoConnection.closeConnectionOnSIGINT(logger);
    closeConnection();
    expect(db.close).toHaveBeenCalledWith(expect.any(Function));
  });
});

describe('logOnClose', () => {
  let logger: Logger;
  beforeEach(() => {
    logger = {
      info: jest.fn(),
    } as any as Logger;
    jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log message and exit process', () => {
    const logOnCloseCallback = mongoConnection.logOnClose(logger);
    logOnCloseCallback();
    expect(logger.info).toHaveBeenCalledWith(
      'Mongoose default connection is disconnected due to application termination',
    );
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
