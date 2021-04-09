"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = __importDefault(require("../../controllers/imageController"));
const upload_1 = require("../../middleware/upload");
const imageController = new imageController_1.default();
exports.default = express_1.Router()
    // Route d'enregistrement d'une image
    .post('/', upload_1.upload.single('file'), imageController.uploadImage)
    // Route de chargement d'une image
    .get('/:name', imageController.downloadImage);
