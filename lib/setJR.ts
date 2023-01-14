import { NextFunction, Response } from 'express';

const setJsonRes = (
  res: Response,
  next: NextFunction,
  response: { body: any; status: number },
) => {
  res.locals.response = response;
  next();
};

export default setJsonRes;
