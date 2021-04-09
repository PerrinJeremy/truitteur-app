"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./routers/user"));
const article_1 = __importDefault(require("./routers/article"));
const auth_1 = __importDefault(require("./routers/auth"));
const image_1 = __importDefault(require("./routers/image"));
const passport_1 = __importDefault(require("passport"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userController = new userController_1.default();
exports.default = express_1.Router()
    // Router Article
    .use("/articles", article_1.default)
    // récupérer profil utilisateur par nom route publique
    .get('/tag/:name', userController.getUserByName)
    // Router User avec middleware de vérification token
    .use("/user", passport_1.default.authenticate('jwt'), user_1.default)
    // Route Authentification
    .use("/auth", auth_1.default)
    // Route pour générer les previews de liens
    .use('/upload', image_1.default);
