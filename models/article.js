"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Article = mongoose_1.model('Article', ArticleSchema);
