import { Request, Response, NextFunction } from 'express';
import { Article } from '../models/article';

export default class ArticleController {

    getArticles = async (req: Request, res: Response) => {
        const page = Number(req.query.page)
        let articles = await Article.find().sort({ createdAt: -1 }).skip(10 * page).limit(10)
        res.status(200).send(articles)
    }

    getUserArticle = async (req: Request, res: Response, next: NextFunction) => {
        const tag = req.params.name;
        const page = Number(req.query.page)
        let articles = await Article.find({ 'author.tag': tag }).sort({ createdAt: -1 }).skip(10 * page).limit(10)
        res.status(200).json(articles);
    };

    createArticle = async (req: Request, res: Response, next: NextFunction) => {
        const author = req.body.author;
        const content = req.body.text;
        const image = req.body.image;
        const article = new Article({
            content: content,
            author: author,
            likes: 0,
            image
        });
        await article.setUrlPreview();
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

    updateArticle = (req: Request, res: Response, next: NextFunction) => {
        const articleId = req.params.id;
        const content = req.body.content;
        Article.findById(articleId)
            .then(async article => {
                if (!article) {
                    const error = new Error('Article inexistant');
                    throw error;
                }
                if (article.author.id !== req.body.author.id) {
                    const error = new Error('Not authorized!');
                    throw error;
                }
                article.content = content;
                await article.setUrlPreview();
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
    updateLikes = (req: Request, res: Response, next: NextFunction) => {
        const articleId = req.params.id;
        const likes = req.body.likes;
        Article.findById(articleId)
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
    deleteArticle = (req: Request, res: Response, next: NextFunction) => {
        const articleId = req.params.id;
        Article.findById(articleId)
            .then(article => {
                if (!article) {
                    const error = new Error('Article introuvable');
                    throw error;
                }
                return Article.findByIdAndRemove(articleId);
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