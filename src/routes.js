import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import checkUserMiddleware from './app/middlewares/checkAdmin';

import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';

const routes = new Router();

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/session', SessionController.store);

routes.post('/students/:id/help-orders', HelpOrdersController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);

routes.get(
  '/students/:id/help-orders',
  checkUserMiddleware,
  HelpOrdersController.index
);

routes.put('/help-orders/:id/answer', HelpOrdersController.update);

routes.post('/plans', checkUserMiddleware, PlansController.store);
routes.get('/plans', checkUserMiddleware, PlansController.index);
routes.delete('/plans/:id', checkUserMiddleware, PlansController.delete);
routes.put('/plans/:id', checkUserMiddleware, PlansController.update);

routes.post('/registration', checkUserMiddleware, RegistrationController.store);
routes.get('/registration', checkUserMiddleware, RegistrationController.index);
routes.delete(
  '/registration/:id',
  checkUserMiddleware,
  RegistrationController.delete
);
routes.put(
  '/registration/:id',
  checkUserMiddleware,
  RegistrationController.update
);

export default routes;
