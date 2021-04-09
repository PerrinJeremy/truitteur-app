import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export default class AuthController {

    login = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local-login', (err, passportUser, info) => {
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
    }

    signup = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local-signup', {
            session: false
        }, async (err, passportUser, info) => {
            if (err || !passportUser) {
                if (err) {
                    console.log(err);
                }
                return res.json({
                    success: false,
                    message: info.message ? info.message : 'Une erreur est survenue'
                });
            };
            let user = passportUser;
            user.token = user.generateJWT();
            return res.json(user.toAuthJSON())
        })(req, res, next);
    }
}