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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config"));
exports.userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    screenname: String,
    password: {
        type: String,
        required: true,
    },
    darktheme: Boolean,
    banner: String,
    picture: String,
    tag: {
        type: String,
        unique: true,
    },
    likes: [String],
    following: [String]
});
const salt = 10;
exports.userSchema.methods = {
    comparePassword: function (candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let verif = yield bcrypt_1.default.compare(candidatePassword, this.password);
            return verif;
        });
    },
    setPassword: function (password) {
        return __awaiter(this, void 0, void 0, function* () {
            let hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
    generateJWT: function () {
        const today = new Date();
        const expirationDate = (((today.getTime()) + (12 * 60 * 60 * 1000)) - (today.getTime() - today.getMilliseconds()) / 1000);
        return jsonwebtoken_1.default.sign({
            email: this.email,
            id: this._id,
            exp: expirationDate,
        }, config_1.default.JWT_SECRET ? config_1.default.JWT_SECRET : 'supertoto');
    },
    toAuthJSON: function () {
        return {
            id: this._id,
            email: this.email,
            name: this.screenname,
            tag: this.tag,
            token: this.token,
            likes: this.likes,
            following: this.following,
            followers: this.followers,
            picture: this.picture,
            banner: this.banner
        };
    }
};
exports.User = mongoose_1.model("User", exports.userSchema);
