import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Configuration from '../../config';
import * as HTTP_STATUS from '../models/constants/httpStatus';
import { IChangePasswordBody, ILoginBody } from '../models/interfaces';
import { mongoSchemas } from '../mongo';

const User = mongoose.model('User', mongoSchemas.UserSchema);
const config = Configuration.instance;
const logger = config.logger;

const authController = () => {
  const login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body as ILoginBody;

      const user = await User.findOne({
        username: username.toLowerCase(),
      });

      if (!user) {
        return res.status(HTTP_STATUS.HTTP_NOT_FOUND).json({
          username: username.toLowerCase(),
          success: false,
          message: 'Authentication failed. User not found!',
          token: null,
        });
      }

      const isTheSamePassword = await bcrypt.compare(
        password,
        user.hashPassword,
      );

      if (!isTheSamePassword) {
        return res.status(HTTP_STATUS.HTTP_UNAUTHORIZED).json({
          username: req.body.username,
          success: false,
          message: 'Authentication failed. Wrong password!',
          token: null,
        });
      }

      return res.json({
        displayName: user.displayName,
        username: user.username,
        success: true,
        message: "You're successfully logged in!",
        type: user.type,
        token: jwt.sign(
          { aud: user.username + ' ' + user.type, _id: user.id },
          config.jwtSecret,
        ),
      });
    } catch (error) {
      logger.error(error);
      return res.status(HTTP_STATUS.HTTP_SERVER_ERROR).json({
        username: req.body.username,
        success: false,
        message: 'Authentication failed. Server error!',
        token: null,
      });
    }
  };

  const changePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(HTTP_STATUS.HTTP_NOT_FOUND).json({
          message: 'Could not change password. User not found!',
        });
      }

      const { oldPassword, newPassword } = req.body as IChangePasswordBody;

      const isTheSamePassword = await bcrypt.compare(
        oldPassword,
        user.hashPassword,
      );

      if (!isTheSamePassword) {
        return res.status(HTTP_STATUS.HTTP_UNAUTHORIZED).json({
          message: 'Wrong password!, could set new password!!',
        });
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(
        req.body.id,
        { hashPassword: newHashedPassword },
        { new: true, useFindAndModify: false },
      );

      return res.status(HTTP_STATUS.HTTP_NO_CONTENT).json({});
    } catch (error) {
      return res
        .status(HTTP_STATUS.HTTP_SERVER_ERROR)
        .json({ message: 'Could not change password. Server Error!!' });
    }
  };

  return { login, changePassword };
};

export default authController;
