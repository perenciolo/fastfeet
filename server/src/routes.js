import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DelivermanController from './app/controllers/DelivermanController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

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

// Delivermen
routes.get('/delivermen', DelivermanController.index);
routes.post('/delivermen', DelivermanController.store);
routes.put('/delivermen/:id', DelivermanController.update);
routes.delete('/delivermen/:id', DelivermanController.delete);

module.exports = routes;
