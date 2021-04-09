import {
    Router
} from 'express';
import ImageController from '../../controllers/imageController';
import { upload } from '../../middleware/upload';

const imageController = new ImageController();

export default Router()
    // Route d'enregistrement d'une image
    .post('/', upload.single('file'), imageController.uploadImage)
    // Route de chargement d'une image
    .get('/:name', imageController.downloadImage)