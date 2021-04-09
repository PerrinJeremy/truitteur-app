import { Schema, model, Model, Document } from 'mongoose';

export interface IArticle extends Document {
    content: String;
    image: String,
    author: {
        id: String,
        name: String,
        tag: String,
    };
    likes: Number

}

const ArticleSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        image: String,
        author: {
            id: String,
            name: String,
            tag: String,
        },
        likes: Number
    },
    { timestamps: true }
);

export const Article: Model<IArticle> = model('Article', ArticleSchema);
