import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DelivermanController from './app/controllers/DelivermanController';
import PackageController from './app/controllers/PackageController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliveriesStatusController from './app/controllers/DeliveriesStatusController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Deliveries
routes.get('/deliverymen/:id/deliveries', DeliveriesController.index);
routes.post(
  '/deliverymen/:id/deliveries/start/:packId',
  DeliveriesStatusController.store
);
routes.post(
  '/deliverymen/:id/deliveries/end/:packId',
  DeliveriesStatusController.end
);
routes.get('/deliverymen/:id/delivered', DeliveriesController.delivered);

// Protected Routes.
routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);

// Recipients
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// Deliverymen
routes.get('/deliverymen', DelivermanController.index);
routes.post('/deliverymen', DelivermanController.store);
routes.put('/deliverymen/:id', DelivermanController.update);
routes.delete('/deliverymen/:id', DelivermanController.delete);

// Package management
routes.get('/packages', PackageController.index);
routes.post('/packages', PackageController.store);
routes.put('/packages/:id', PackageController.update);
routes.delete('/packages/:id', PackageController.delete);

module.exports = routes;
