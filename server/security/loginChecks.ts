import { NextFunction, Request } from 'express';
import { IContentResponse } from '../models/interfaces';

import * as HTTP_STATUS from '../models/constants/httpStatus';

export const loginRequired = (
  req: Request,
  res: IContentResponse,
  next: NextFunction,
) => {
  if (
    res.locals.user &&
    (res.locals.user.aud.split(' ')[1] === 'vent' ||
      res.locals.user.aud.split(' ')[1] === 'admin' ||
      res.locals.user.aud.split(' ')[1] === 'contador')
  ) {
    return next();
  }

  return res
    .status(HTTP_STATUS.HTTP_UNAUTHORIZED)
    .content({ message: 'User not authorized' });
};
