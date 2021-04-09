import {
    Router
} from 'express';
import UserController from '../../controllers/userController';

const userController = new UserController();

export default Router()
    // récupérer profil utilisateur par id
    .get('/:id', userController.getUser)
    // mettre à jour le profil utilisateur
    .post('/:id', userController.updateUser)
    // supprimer un utilisateur
    .delete('/:id', userController.deleteUser)
    // Ajouter un abonnement
    .post('/follow/:id', userController.follow)
    // Supprimer un abonnement
    .post('/unfollow/:id', userController.unfollow)
    // Ajouter un like
    .post('/like/:id', userController.like)
    // Supprimer un like
    .post('/unlike/:id', userController.unlike)