"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../../controllers/authController"));
const authController = new authController_1.default();
exports.default = express_1.Router()
    // Route d'identificationn utilisateur
    .post('/login', authController.login)
    // Route d'inscription utilisateur
    .post('/signup', authController.signup);
