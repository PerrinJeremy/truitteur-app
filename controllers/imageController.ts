import { Request, Response, NextFunction } from 'express';
import { Image } from "../models/image";
import { createConnection, mongo } from 'mongoose';

const connect = createConnection('mongodb://localhost:27017/botMind', { useNewUrlParser: true, useUnifiedTopology: true });

let gfs: any;

connect.once('open', () => {
    gfs = new mongo.GridFSBucket(connect.db, {
        bucketName: "uploads"
    });
});

export default class ImageController {

    uploadImage = (req: Request, res: Response, next: NextFunction) => {
        Image.findOne({ caption: req.body.caption })
            .then(async (image) => {
                if (image) {
                    return res.status(200).json({
                        success: false,
                        message: 'Image existante',
                        image
                    });
                }

                let newImage = new Image({
                    caption:  req.body.caption,
                    filename: req.file.filename,
                    fileId: req.file.id,
                });

                await newImage.save()
                    .then((image) => {
                        res.status(200).json({
                            success: true,
                            image,
                        });
                    })
                    .catch(err => {                        
                        res.status(500).json(err)});
            })
            .catch(err => res.status(500).json(err));
    }

    downloadImage = (req: Request, res: Response, next: NextFunction) => {
        gfs.find({ filename: req.params.name })
            .toArray((err: Error, files: any) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }
                if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                    gfs.openDownloadStreamByName(files[0].filename).pipe(res);
                } else {
                    res.status(404).json({
                        err: 'Not an image',
                    });
                }
            })
    };

}

