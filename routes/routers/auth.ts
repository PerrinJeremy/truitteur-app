import {
    Router
} from 'express';
import AuthController from '../../controllers/authController';

const authController = new AuthController();

export default Router()
    // Route d'identificationn utilisateur
    .post('/login', authController.login)
    // Route d'inscription utilisateur
    .post('/signup', authController.signup)