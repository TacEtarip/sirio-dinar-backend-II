import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { parseToken } from '../../../server/security';

describe('parseToken', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer my-token',
      },
    } as Request;
    res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as any as Response;
    next = jest.fn();
  });

  it('should set res.locals.user if the token is valid', async () => {
    // Arrange
    const decoded = { userId: '123' };
    jest
      .spyOn(jwt, 'verify')
      .mockImplementation((token, secret, cb: any) => cb(null, decoded));

    // Act
    await parseToken(req, res, next);

    // Assert
    expect(res.locals.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid', async () => {
    // Arrange
    jest
      .spyOn(jwt, 'verify')
      .mockImplementation((token, secret, cb: any) => cb(new Error()));

    // Act
    parseToken(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if the authorization header is not present', async () => {
    // Arrange
    delete req.headers.authorization;

    // Act
    await parseToken(req, res, next);

    // Assert
    expect(res.locals.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
