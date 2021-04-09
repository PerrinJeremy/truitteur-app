import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import * as crypto from 'crypto';
import path from 'path';

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/botMind',
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