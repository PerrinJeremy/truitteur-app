import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import * as crypto from 'crypto';
import path from 'path';
import config from '../config';

const storage = new GridFsStorage({
  url: `mongodb+srv://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_DOMAIN}/${config.DB_NAME}`,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

export const upload = multer({ storage });