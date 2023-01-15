import { authController } from '../controllers';
import { authPaths } from '../models/constants/pathts';
import { ISirioRouter } from '../models/interfaces/ISirioRouter';
import SirioRouter from './SirioRouter';

class AuthRouter extends SirioRouter implements ISirioRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Welcome to Auth Router!');
    });

    const controller = authController();

    this.router.post(authPaths.API_PATH_LOGIN, controller.login);
  }
}

export default AuthRouter;
