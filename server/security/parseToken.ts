import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Configuration from '../../config';

const config = Configuration.instance;

export const parseToken = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const authString = req.headers.authorization;
    const token = authString.split(' ')[1];

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      res.locals.user = decoded;
      return next();
    });
  } else {
    delete res.locals.user;
    return next();
  }
};
