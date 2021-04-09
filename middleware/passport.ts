import passport from "passport";
import { User, IUser } from '../models/user';
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CallbackError } from "mongoose";
import { Request } from 'express';
import { VerifyCallback, VerifyErrors } from "jsonwebtoken";
import config from "../config";

const JWTStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
    passReqToCallback: true,
  },
  async (req: Request, jwtPayload: any, done: VerifyCallback) => {
    await User.findOne({ email: jwtPayload.email }).then((user) => {
      return done(null, {
        user: user,
        id: jwtPayload.id,
      });
    }).catch((err: VerifyErrors) => done(err,{}));
  }
);

const RegisterStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  async (req: Request, email: string, password: string, done) => {

    await User.findOne({
      email: email,
    })
      .then(async (user: any) => {
        if (user) {
          return done(null, false, {
            message: "Cette adresse email est déjà prise",
          });
        } else {
          let newUser = new User();
          newUser.email = email;
          newUser.screenname = req.body.name;
          newUser.password = await newUser.setPassword(password)
          newUser.darktheme = false;
          await newUser
            .save()
            .then(() => {
              return done(null, newUser, {
                message: "Utilisateur créé avec succès",
              });
            })
            .catch((err: Error) => {
              console.log(err);
              return done(null, false, {
                message: err.message,
              });
            });
        }
      })
      .catch((err: Error) => {
        return done(err);
      });
  }
);

const LoginStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    let verification = false;
    await User.findOne({
      email: email,
    })
      .then(async (user: any) => {
        verification = await user.comparePassword(password);
        if (verification) {
          return done(null, user, {
            message: "Connecté avec succès",
          });
        } else {
          return done(null, false, {
            message: "Mot de passe incorrect",
          });
        }
      })
      .catch((err: Error) => {
        if (err) console.log(err);
        return done(null, false, {
          message: "Il n'y a aucun utilisateur enregistré avec cet email",
        });
      });
  }
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: CallbackError, user: IUser) => {
    done(err, user);
  });
});

passport.use("local-signup", RegisterStrategy);

passport.use("local-login", LoginStrategy);

passport.use("jwt", JWTStrategy);