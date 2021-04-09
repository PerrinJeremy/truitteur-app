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
const user_1 = require("../models/user");
class UserController {
    constructor() {
        this.getUser = (req, res, next) => {
            const userId = req.params.id;
            user_1.User.findById(userId)
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user.followers = yield user_1.User.countDocuments({ following: { $all: [userId] } });
                res.status(200).json(user.toAuthJSON());
            }))
                .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        };
        this.getUserByName = (req, res, next) => {
            const name = req.params.name;
            user_1.User.find({ tag: name })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (!user[0]) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user[0].followers = yield user_1.User.countDocuments({ following: { $all: [user[0]._id] } });
                res.status(200).json(user[0].toAuthJSON());
            }))
                .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        };
        this.updateUser = (req, res, next) => {
            const userId = req.body.id;
            const { likes, tag, banner, picture } = req.body;
            user_1.User.findById(userId)
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
        this.deleteUser = (req, res, next) => {
            const userId = req.params.id;
            user_1.User.findById(userId)
                .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                return user_1.User.findByIdAndRemove(userId);
            })
                .then(() => {
                res.status(200).json({ message: 'Article supprimé' });
            })
                .catch(err => {
                res.status(500).json({ message: "Une erreur s'est produite" });
            });
        };
        this.follow = (req, res, next) => {
            const userId = req.params.id;
            const followId = req.body.id;
            user_1.User.findById(userId)
                .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                if (user.following.indexOf(followId) === -1) {
                    user.following.push(followId);
                }
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
        this.unfollow = (req, res, next) => {
            const userId = req.params.id;
            const followId = req.body.id;
            user_1.User.findById(userId)
                .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user.following = user.following.filter((id) => id !== followId);
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
        this.like = (req, res, next) => {
            const userId = req.params.id;
            const articleId = req.body.id;
            user_1.User.findById(userId)
                .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                if (user.likes.indexOf(articleId) === -1) {
                    user.likes.push(articleId);
                }
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
        this.unlike = (req, res, next) => {
            const userId = req.params.id;
            const articleId = req.body.id;
            user_1.User.findById(userId)
                .then(user => {
                if (!user) {
                    const error = new Error('Utilisateur inexistant');
                    throw error;
                }
                user.likes = user.likes.filter((id) => id !== articleId);
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
    }
}
exports.default = UserController;
