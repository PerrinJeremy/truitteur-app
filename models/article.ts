import { Schema, model, Model, Document } from 'mongoose';
const { linkPreview } = require('link-preview-node');

export interface IArticle extends Document {
    content: string;
    image: String;
    author: {
        id: String;
        name: String;
        tag: String;
    };
    likes: Number;
    url: {
        url: string;
        title: string;
        description: string;
        img: string;
        domain: string;
    }
    setUrlPreview(): any
}

const articleSchema: Schema<IArticle> = new Schema(
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
        likes: Number,
        url: {
            url: String,
            title: String,
            img: String,
            domain: String,
            description: String
        }
    },
    { timestamps: true }
);

articleSchema.methods = {
    setUrlPreview: async function () {
        let matcher = /(https?:\/\/[^ ]*)/;
        let matching = this.content.match(matcher);
        if (matching) {
            let url: string = matching[0]
            return await linkPreview(matching[0]).then((res: any) => {
                this.url.url = url;
                this.url.title = res.title;
                this.url.description = res.description;
                this.url.domain = res.domain;
                this.url.img = res.image;
            })
        } else {
            return false
        }
    }
}

export const Article: Model<IArticle> = model<IArticle>('Article', articleSchema);
