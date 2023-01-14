import SirioRouter from './SirioRouter';

class InventoryRouter extends SirioRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Welcome to InventoryRouter!');
    });
  }
}

export default InventoryRouter;
