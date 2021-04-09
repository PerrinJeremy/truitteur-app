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
const user_1 = require("../models/user");
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const config_1 = __importDefault(require("../config"));
const JWTStrategy = new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.default.JWT_SECRET,
    passReqToCallback: true,
}, (req, jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.findOne({ email: jwtPayload.email }).then((user) => {
        return done(null, {
            user: user,
            id: jwtPayload.id,
        });
    }).catch((err) => done(err, {}));
}));
const RegisterStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.findOne({
        email: email,
    })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            return done(null, false, {
                message: "Cette adresse email est déjà prise",
            });
        }
        else {
            let newUser = new user_1.User();
            newUser.email = email;
            newUser.screenname = req.body.name;
            newUser.password = yield newUser.setPassword(password);
            newUser.darktheme = false;
            yield newUser
                .save()
                .then(() => {
                return done(null, newUser, {
                    message: "Utilisateur créé avec succès",
                });
            })
                .catch((err) => {
                console.log(err);
                return done(null, false, {
                    message: err.message,
                });
            });
        }
    }))
        .catch((err) => {
        return done(err);
    });
}));
const LoginStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    let verification = false;
    yield user_1.User.findOne({
        email: email,
    })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        verification = yield user.comparePassword(password);
        if (verification) {
            return done(null, user, {
                message: "Connecté avec succès",
            });
        }
        else {
            return done(null, false, {
                message: "Mot de passe incorrect",
            });
        }
    }))
        .catch((err) => {
        if (err)
            console.log(err);
        return done(null, false, {
            message: "Il n'y a aucun utilisateur enregistré avec cet email",
        });
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.User.findById(id, (err, user) => {
        done(err, user);
    });
});
passport_1.default.use("local-signup", RegisterStrategy);
passport_1.default.use("local-login", LoginStrategy);
passport_1.default.use("jwt", JWTStrategy);
