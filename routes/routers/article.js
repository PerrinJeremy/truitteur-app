"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleController_1 = __importDefault(require("../../controllers/articleController"));
const articleController = new articleController_1.default();
exports.default = express_1.Router()
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
    .delete('/:id', articleController.deleteArticle);
