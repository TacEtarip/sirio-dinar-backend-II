import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Configuration from '../../config';
import * as HTTP_STATUS from '../models/constants/httpStatus';
import { ILoginBody } from '../models/interfaces';
import { mongoSchemas } from '../mongo';
import { IContentResponse } from './../models/interfaces/IResponse';

const User = mongoose.model('User', mongoSchemas.UserSchema);
const config = Configuration.instance;
const logger = config.logger;

const authController = () => {
  const login = async (req: Request, res: IContentResponse) => {
    try {
      const { username, password } = req.body as ILoginBody;

      const user = await User.findOne({
        username: username.toLowerCase(),
      });

      if (!user) {
        return res.status(HTTP_STATUS.HTTP_NOT_FOUND).content({
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
        return res.status(HTTP_STATUS.HTTP_UNAUTHORIZED).content({
          username: username.toLowerCase(),
          success: false,
          message: 'Authentication failed. Wrong password!',
          token: null,
        });
      }

      return res.status(HTTP_STATUS.HTTP_ACCEPTED).content({
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

      return res.status(HTTP_STATUS.HTTP_SERVER_ERROR).content({
        username: req.body.username,
        success: false,
        message: 'Authentication failed. Server error!',
        token: null,
      });
    }
  };

  return { login };
};
export default authController;
