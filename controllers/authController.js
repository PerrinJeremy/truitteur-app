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
const passport_1 = __importDefault(require("passport"));
class AuthController {
    constructor() {
        this.login = (req, res, next) => {
            passport_1.default.authenticate('local-login', (err, passportUser, info) => {
                if (err || !passportUser) {
                    if (err) {
                        console.log(err);
                    }
                    return res.json({
                        success: false,
                        message: info.message ? info.message : 'Une erreur est survenue'
                    });
                }
                const user = passportUser;
                user.token = user.generateJWT();
                return res.json(user.toAuthJSON());
            })(req, res, next);
        };
        this.signup = (req, res, next) => {
            passport_1.default.authenticate('local-signup', {
                session: false
            }, (err, passportUser, info) => __awaiter(this, void 0, void 0, function* () {
                if (err || !passportUser) {
                    if (err) {
                        console.log(err);
                    }
                    return res.json({
                        success: false,
                        message: info.message ? info.message : 'Une erreur est survenue'
                    });
                }
                ;
                let user = passportUser;
                user.token = user.generateJWT();
                return res.json(user.toAuthJSON());
            }))(req, res, next);
        };
    }
}
exports.default = AuthController;
