import { Router } from 'express';
import * as modules from '@/app/modules';

export const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: modules.AuthRoutes,
  },
  {
    path: '/user',
    route: modules.UserRoutes,
  },
  {
    path: '/transaction',
    route: modules.TransactionRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});
