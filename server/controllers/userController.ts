import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Configuration from '../../config';
import setJsonRes from '../../lib/setJR';
import * as HTTP_STATUS from '../models/constants/httpStatus';
import { IChangePasswordBody, IResponse } from '../models/interfaces';
import { mongoSchemas } from '../mongo';

const User = mongoose.model('User', mongoSchemas.UserSchema);
const config = Configuration.instance;
const logger = config.logger;

const userController = () => {
  const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        const noUserResponse: IResponse<any> = {
          status: HTTP_STATUS.HTTP_NOT_FOUND,
          body: {
            message: 'Could not change password. User not found!',
          },
        };
        return setJsonRes(res, next, noUserResponse);
      }

      const { oldPassword, newPassword } = req.body as IChangePasswordBody;

      const isTheSamePassword = await bcrypt.compare(
        oldPassword,
        user.hashPassword,
      );

      if (!isTheSamePassword) {
        const incorrectPasswordResponse: IResponse<any> = {
          status: HTTP_STATUS.HTTP_UNAUTHORIZED,
          body: {
            message: 'Wrong password!, could set new password!!',
          },
        };
        return setJsonRes(res, next, incorrectPasswordResponse);
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(
        req.body.id,
        { hashPassword: newHashedPassword },
        { new: true, useFindAndModify: false },
      );

      const response: IResponse<any> = {
        status: HTTP_STATUS.HTTP_NO_CONTENT,
        body: {},
      };

      return setJsonRes(res, next, response);
    } catch (error) {
      logger.error(error);
      const serverErrorResponse: IResponse<any> = {
        status: HTTP_STATUS.HTTP_ACCEPTED,
        body: { message: 'Could not change password. Server Error!!' },
      };
      return setJsonRes(res, next, serverErrorResponse);
    }
  };

  const getUserByUsername = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const username = req.params.username.toLowerCase();

      const user = await User.findOne({
        username,
      }).exec();

      if (!user) {
        const noUserResponse: IResponse<any> = {
          status: HTTP_STATUS.HTTP_NOT_FOUND,
          body: {
            message: 'User not found!',
          },
        };
        return setJsonRes(res, next, noUserResponse);
      }

      user.hashPassword = undefined;

      const response: IResponse<any> = {
        status: HTTP_STATUS.HTTP_ACCEPTED,
        body: user.toJSON(),
      };

      return setJsonRes(res, next, response);
    } catch (error) {
      logger.error(error);
      const serverErrorResponse: IResponse<any> = {
        status: HTTP_STATUS.HTTP_ACCEPTED,
        body: { message: 'Could not get user. Sever error!!' },
      };
      return setJsonRes(res, next, serverErrorResponse);
    }
  };

  return { getUserByUsername, changePassword };
};

export default userController;
