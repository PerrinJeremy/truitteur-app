"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("../models/image");
const mongoose_1 = require("mongoose");
const connect = mongoose_1.createConnection('mongodb://localhost:27017/botMind', { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;
connect.once('open', () => {
    gfs = new mongoose_1.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads"
    });
});
class ImageController {
    constructor() {
        this.uploadImage = (req, res, next) => {
            image_1.Image.findOne({ caption: req.body.caption })
                .then((image) => __awaiter(this, void 0, void 0, function* () {
                if (image) {
                    return res.status(200).json({
                        success: false,
                        message: 'Image existante',
                        image
                    });
                }
                let newImage = new image_1.Image({
                    caption: req.body.caption,
                    filename: req.file.filename,
                    fileId: req.file.id,
                });
                yield newImage.save()
                    .then((image) => {
                    res.status(200).json({
                        success: true,
                        image,
                    });
                })
                    .catch(err => {
                    res.status(500).json(err);
                });
            }))
                .catch(err => res.status(500).json(err));
        };
        this.downloadImage = (req, res, next) => {
            gfs.find({ filename: req.params.name })
                .toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }
                if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                    gfs.openDownloadStreamByName(files[0].filename).pipe(res);
                }
                else {
                    res.status(404).json({
                        err: 'Not an image',
                    });
                }
            });
        };
    }
}
exports.default = ImageController;
