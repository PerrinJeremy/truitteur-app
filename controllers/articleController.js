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
const article_1 = require("../models/article");
class ArticleController {
    constructor() {
        this.getArticles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page);
            let articles = yield article_1.Article.find().sort({ createdAt: -1 }).skip(10 * page).limit(10);
            res.status(200).send(articles);
        });
        this.getUserArticle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const tag = req.params.name;
            const page = Number(req.query.page);
            let articles = yield article_1.Article.find({ 'author.tag': tag }).sort({ createdAt: -1 }).skip(10 * page).limit(10);
            res.status(200).json(articles);
        });
        this.createArticle = (req, res, next) => {
            console.log(req.body);
            const author = req.body.author;
            const content = req.body.text;
            const image = req.body.image;
            const article = new article_1.Article({
                content: content,
                author: author,
                likes: 0,
                image
            });
            article
                .save()
                .then(() => {
                res.status(201).json({
                    message: 'Article enregistré avec succès'
                });
            })
                .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        };
        this.updateArticle = (req, res, next) => {
            const articleId = req.params.id;
            const content = req.body.content;
            article_1.Article.findById(articleId)
                .then(article => {
                if (!article) {
                    const error = new Error('Article inexistant');
                    throw error;
                }
                if (article.author.id !== req.body.author.id) {
                    const error = new Error('Not authorized!');
                    throw error;
                }
                article.content = content;
                return article.save();
            })
                .then(() => {
                res.status(200).json({ message: 'Article mis à jour' });
            })
                .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        };
        this.updateLikes = (req, res, next) => {
            const articleId = req.params.id;
            const likes = req.body.likes;
            article_1.Article.findById(articleId)
                .then(article => {
                if (!article) {
                    const error = new Error('Article inexistant');
                    throw error;
                }
                article.likes = likes;
                return article.save();
            })
                .then(() => {
                res.status(200).json({ message: 'Article mis à jour' });
            })
                .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        };
        this.deleteArticle = (req, res, next) => {
            const articleId = req.params.postId;
            article_1.Article.findById(articleId)
                .then(article => {
                if (!article) {
                    const error = new Error('Article introuvable');
                    throw error;
                }
                if (article.author !== req.body.author) {
                    const error = new Error('Non authorisé');
                    throw error;
                }
                return article_1.Article.findByIdAndRemove(articleId);
            })
                .then(() => {
                res.status(200).json({ message: 'Article supprimé' });
            })
                .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        };
    }
}
exports.default = ArticleController;
