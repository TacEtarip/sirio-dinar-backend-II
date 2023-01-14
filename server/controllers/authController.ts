import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Configuration from '../../config';
import setJsonRes from '../../lib/setJR';
import * as HTTP_STATUS from '../models/constants/httpStatus';
import { ILoginBody, IResponse } from '../models/interfaces';
import { mongoSchemas } from '../mongo';

const User = mongoose.model('User', mongoSchemas.UserSchema);
const config = Configuration.instance;
const logger = config.logger;

const authController = () => {
  const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body as ILoginBody;

      const user = await User.findOne({
        username: username.toLowerCase(),
      });

      if (!user) {
        const noUserResponse: IResponse<any> = {
          status: HTTP_STATUS.HTTP_NOT_FOUND,
          body: {
            username: username.toLowerCase(),
            success: false,
            message: 'Authentication failed. User not found!',
            token: null,
          },
        };
        return setJsonRes(res, next, noUserResponse);
      }

      const isTheSamePassword = await bcrypt.compare(
        password,
        user.hashPassword,
      );

      if (!isTheSamePassword) {
        const incorrectPasswordResponse: IResponse<any> = {
          status: HTTP_STATUS.HTTP_UNAUTHORIZED,
          body: {
            username: req.body.username,
            success: false,
            message: 'Authentication failed. Wrong password!',
            token: null,
          },
        };
        return setJsonRes(res, next, incorrectPasswordResponse);
      }
      const response: IResponse<any> = {
        status: HTTP_STATUS.HTTP_ACCEPTED,
        body: {
          displayName: user.displayName,
          username: user.username,
          success: true,
          message: "You're successfully logged in!",
          type: user.type,
          token: jwt.sign(
            { aud: user.username + ' ' + user.type, _id: user.id },
            config.jwtSecret,
          ),
        },
      };
      return setJsonRes(res, next, response);
    } catch (error) {
      logger.error(error);
      const serverErrorResponse: IResponse<any> = {
        status: HTTP_STATUS.HTTP_SERVER_ERROR,
        body: {
          username: req.body.username,
          success: false,
          message: 'Authentication failed. Server error!',
          token: null,
        },
      };
      return setJsonRes(res, next, serverErrorResponse);
    }
  };

  return { login };
};

export default authController;
