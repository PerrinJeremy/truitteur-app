"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../../controllers/userController"));
const userController = new userController_1.default();
exports.default = express_1.Router()
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
    .post('/unlike/:id', userController.unlike);
