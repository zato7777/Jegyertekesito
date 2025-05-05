import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";


const SALT_FACTOR = 10;

interface IUser extends Document {
    nickname: string;
    email: string;
    password: string;
    name?: string;
    address?: string;
    telephone?: string;
    isAdmin: boolean;
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    nickname: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String, required: false},
    address: {type: String, required: false},
    telephone: {type: String, unique: true, required: false},
    isAdmin: {type: Boolean, required: true}
});

UserSchema.pre<IUser>("save", function(next) {
    const user = this;
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }

        bcrypt.hash(user.password, salt, (error2, encrypted) => {
            if (error2) {
                return next(error2);
            }

            user.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            callback(error, false);
        }

        callback(null, isMatch);
    });
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema); 
