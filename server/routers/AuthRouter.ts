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

    this.router.post(authPaths.API_PATH_LOGIN, (req, res) => {
      res.send('Welcome to Auth Router!');
    });
  }
}

export default AuthRouter;
