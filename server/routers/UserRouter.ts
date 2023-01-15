import { userController } from '../controllers';
import { userPaths } from '../models/constants/pathts';
import { ISirioRouter } from '../models/interfaces/ISirioRouter';
import { loginChecks } from '../security';
import SirioRouter from './SirioRouter';

class UserRouter extends SirioRouter implements ISirioRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Welcome to User Router!');
    });

    const controller = userController();

    this.router.patch(
      userPaths.API_PATH_CHANGE_PASSWORD,
      controller.changePassword,
    );

    this.router.get(
      userPaths.API_PATH_GET_USER_BY_USERNAME,
      controller.getUserByUsername,
    );

    this.router.get(
      userPaths.API_PATH_GET_LOGGED_USER,
      loginChecks.loginRequired,
      controller.getLoggedUser,
    );
  }
}

export default UserRouter;
