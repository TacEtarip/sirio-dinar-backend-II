import http from 'http';
import request from 'supertest';
import startServer from '../../server';

describe('Server', () => {
  let server: http.Server;
  let app: Express.Application;

  beforeAll(async () => {
    const [beforeServer, beforeApp] = await startServer();
    server = beforeServer;
    app = beforeApp;
    process.env.NODE_ENV = 'test';
  });

  it('should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    server.close();
  });
});
