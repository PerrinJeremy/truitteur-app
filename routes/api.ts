import { Router } from 'express';
import user from './routers/user';
import article from './routers/article';
import auth from './routers/auth';
import image from './routers/image';
import passport from 'passport';
import UserController from '../controllers/userController';

const userController = new UserController();

export default Router()
    // Router Article
    .use("/articles", article)
    // récupérer profil utilisateur par nom route publique
    .get('/tag/:name', userController.getUserByName)
    // Router User avec middleware de vérification token
    .use("/user", passport.authenticate('jwt'), user)
    // Route Authentification
    .use("/auth", auth)
    // Route pour générer les previews de liens
    .use('/upload', image)