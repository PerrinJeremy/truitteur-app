import { Schema, model, Model, Document } from 'mongoose';

const ImageSchema = new Schema(
    {
        caption: {
            required: true,
            type: String,
        },
        filename: {
            required: true,
            type: String,
        }
    },
    { timestamps: true }
);

export const Image = model('Image', ImageSchema);
