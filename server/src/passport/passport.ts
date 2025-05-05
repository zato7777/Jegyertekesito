import passport, { PassportStatic } from "passport";
import { Strategy } from "passport-local";
import { Express } from "express";
import { User } from "../model/User";


export const configurePassport = (passport: PassportStatic): PassportStatic => {
    passport.serializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.use("local", new Strategy((username, password, done) => {
        const query = User.findOne({email: username});
        query.then(user => {
            if (user) {
                user.comparePassword(password, (error, isMatch) => {
                    if (error || !isMatch) {
                        done("Incorrect username or password!");
                    } else {
                        done(null, user._id!);
                    }
                });
            } else {
                done(null, undefined);
            }
        }).catch(error => {
            done(error);
        });
    }));

    return passport;
};