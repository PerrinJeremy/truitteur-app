import {
  Router, Request, Response
} from 'express';
import ArticleController from '../../controllers/articleController';

const articleController = new ArticleController();

export default Router()
  // récupérer tous les articles
  .get('/', articleController.getArticles)
  // récupérer tous les articles d'un utilisateur
  .get('/:name', articleController.getUserArticle)
  // créer un article
  .post('/', articleController.createArticle)
  // mettre à jour un article
  .put('/:id', articleController.updateArticle)
  // mettre à jour les likes
  .put('/likes/:id', articleController.updateLikes)
  // supprimer un article
  .delete('/:id', articleController.deleteArticle)