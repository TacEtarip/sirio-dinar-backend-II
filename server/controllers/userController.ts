import bcrypt from 'bcrypt';
import { Request } from 'express';
import mongoose from 'mongoose';
import Configuration from '../../config';
import * as HTTP_STATUS from '../models/constants/httpStatus';
import { IChangePasswordBody } from '../models/interfaces';
import { mongoSchemas } from '../mongo';
import { IContentResponse } from './../models/interfaces/IResponse';

const User = mongoose.model('User', mongoSchemas.UserSchema);
const config = Configuration.instance;
const logger = config.logger;

const userController = () => {
  const changePassword = async (req: Request, res: IContentResponse) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(HTTP_STATUS.HTTP_NOT_FOUND).content({
          message: 'Could not change password. User not found!',
        });
      }

      const { oldPassword, newPassword } = req.body as IChangePasswordBody;

      const isTheSamePassword = await bcrypt.compare(
        oldPassword,
        user.hashPassword,
      );

      if (!isTheSamePassword) {
        return res.status(HTTP_STATUS.HTTP_UNAUTHORIZED).content({
          message: 'Wrong password!, could set new password!!',
        });
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(
        req.body.id,
        { hashPassword: newHashedPassword },
        { new: true, useFindAndModify: false },
      );

      return res.status(HTTP_STATUS.HTTP_NO_CONTENT).content({});
    } catch (error) {
      logger.error(error);
      return res.status(HTTP_STATUS.HTTP_ACCEPTED).content({
        message: 'Could not change password. Server Error!!',
      });
    }
  };

  const getUserByUsername = async (req: Request, res: IContentResponse) => {
    try {
      const username = req.params.username.toLowerCase();

      const user = await User.findOne({
        username,
      }).exec();

      if (!user) {
        return res.status(HTTP_STATUS.HTTP_NOT_FOUND).content({
          message: 'User not found!',
        });
      }

      user.hashPassword = undefined;

      return res.status(HTTP_STATUS.HTTP_ACCEPTED).content(user.toJSON());
    } catch (error) {
      logger.error(error);
      return res.status(HTTP_STATUS.HTTP_ACCEPTED).content({
        message: 'Could not get user. Sever error!!',
      });
    }
  };

  const getLoggedUser = async (req: Request, res: IContentResponse) => {
    try {
      if (!res.locals.user) {
        return res.status(HTTP_STATUS.HTTP_UNAUTHORIZED).content({
          message: 'Could not get the logged user. User not logged in!',
        });
      }
      const username = res.locals.user.aud.split(' ')[0];
      const user = await User.findOne({
        username,
      });

      user.hashPassword = undefined;

      res.status(HTTP_STATUS.HTTP_OK).content(user.toJSON());
    } catch (error) {
      return res
        .status(HTTP_STATUS.HTTP_SERVER_ERROR)
        .content({ message: 'Could not get the logged user. Server error!!' });
    }
  };

  return { changePassword, getUserByUsername, getLoggedUser };
};

export default userController;
