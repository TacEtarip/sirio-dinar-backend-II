import pino, { Logger } from 'pino';

class Configuration {
  private static _instance: Configuration;

  private _port: number;
  private _workers: number;
  private _logger: Logger;
  private _jwtSecret: string;
  private _mongoUri: string;

  constructor(enviroment: string) {
    this._port = parseInt(process.env.PORT, 10) || 3000;
    this._workers = parseInt(process.env.WORKERS, 10) || 1;
    this._logger = pino({ level: process.env.LOG_LEVEL || 'info' });
    this._jwtSecret = process.env.JWT_SECRET || 'secret';
    this._mongoUri = process.env.MONGO_URI;
  }

  public static get instance(): Configuration {
    if (!this._instance) {
      this._instance = new Configuration(process.env.NODE_ENV);
    }
    return this._instance;
  }

  getConfiguration() {
    return {
      port: this._port,
      workers: this._workers,
    };
  }

  get port() {
    return this._port;
  }

  set port(port: number) {
    this._port = port;
  }

  get workers() {
    return this._workers;
  }

  set workers(number: number) {
    this._workers = number;
  }

  get logger() {
    return this._logger;
  }

  get jwtSecret() {
    return this._jwtSecret;
  }

  get mongoUri() {
    return this._mongoUri;
  }
}

export default Configuration;
