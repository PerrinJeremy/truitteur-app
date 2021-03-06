import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { Article } from '../models/article';

export default class UserController {

    getUser = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        User.findById(userId)
            .then(async user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                //Ajout nombre abonnés
                user.followers = await User.countDocuments({ following: { $all: [userId] } })
                //Ajout nombre articles
                user.articles = await Article.countDocuments({ 'author.id': userId })
                res.status(200).json(user.toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    };
    getProposalList = (req: Request, res: Response, next: NextFunction) => {
        const { following, id } = req.body;
        if (id == "") {
            User.find({ _id: { $nin: following } }).limit(5)
                .then(async users => {
                    let result: any = [];
                    for (let user of users) {
                        //Ajout nombre abonnés
                        user.followers = await User.countDocuments({ following: { $all: [user.id] } })
                        result.push(user.toAuthJSON())
                    }
                    res.status(200).json({ users: result });
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        } else {
            User.find({ $and: [{ _id: { $nin: following } }, { _id: { $ne: id } }] }).limit(5)
                .then(async users => {
                    let result: any = [];
                    for (let user of users) {
                        //Ajout nombre abonnés
                        user.followers = await User.countDocuments({ following: { $all: [user.id] } })
                        result.push(user.toAuthJSON())
                    }
                    res.status(200).json({ users: result });
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        }
    };
    getUserByName = (req: Request, res: Response, next: NextFunction) => {
        const name = req.params.name;
        User.find({ tag: name })
            .then(async user => {
                if (!user[0]) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                //Ajout nombre abonnés
                user[0].followers = await User.countDocuments({ following: { $all: [user[0]._id] } })
                //Ajout nombre articles
                user[0].articles = await Article.countDocuments({ 'author.id': user[0].id })
                res.status(200).json(user[0].toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    };

    updateUser = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.body.id;
        const {
            likes,
            tag,
            banner,
            picture
        } = req.body
        User.findById(userId)
            .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user.likes = likes;
                user.tag = tag;
                user.banner = banner;
                user.picture = picture;
                return user.save();
            })
            .then((user) => {
                res.status(200).json(user.toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    };

    deleteUser = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        User.findById(userId)
            .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }

                return User.findByIdAndRemove(userId);
            })
            .then(() => {
                res.status(200).json({ message: 'Article supprimé' });
            })
            .catch(err => {
                res.status(500).json({ message: "Une erreur s'est produite" });
            });
    };

    follow = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const followId = req.body.id;
        User.findById(userId)
            .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                if (user.following.indexOf(followId) === -1) {
                    user.following.push(followId);
                }
                return user.save()
            })
            .then((user) => {
                res.status(200).json(user.toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }

    unfollow = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const followId = req.body.id;
        User.findById(userId)
            .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user.following = user.following.filter((id) => id !== followId);
                return user.save()
            })
            .then((user) => {
                res.status(200).json(user.toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }

    like = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const articleId = req.body.id;
        User.findById(userId)
            .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                if (user.likes.indexOf(articleId) === -1) {
                    user.likes.push(articleId);
                }
                return user.save()
            })
            .then((user) => {
                res.status(200).json(user.toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }

    unlike = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const articleId = req.body.id;
        User.findById(userId)
            .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user.likes = user.likes.filter((id) => id !== articleId);
                return user.save()
            })
            .then((user) => {
                res.status(200).json(user.toAuthJSON());
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err)
            });
    }
}