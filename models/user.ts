import jwt from "jsonwebtoken";
import { Schema, Model, Document, model, Error } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

export interface IUser extends Document {
  email: string;
  password: string;
  screenname: string;
  tag: string;
  setPassword(password: string): string;
  toAuthJSON(): {};
  comparePassword(password: string): boolean;
  darktheme: boolean;
  likes: String[];
  following: String[];
  token: String;
  followers: Number;
  banner: string;
  picture: string;
  articles:number;
}

export const userSchema: Schema<IUser> = new Schema({
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
  following: [String],
});

const salt = 10;

userSchema.methods = {
  comparePassword: async function (candidatePassword: string) {
    let verif = await bcrypt.compare(candidatePassword, this.password)
    return verif
  },

  setPassword: async function (password: string) {
    let hash = await bcrypt.hash(password, salt)
    return hash
  },
  generateJWT: function () {
    const today = new Date();
    const expirationDate = (((today.getTime()) + (12 * 60 * 60 * 1000)) - (today.getTime() - today.getMilliseconds()) / 1000);
    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: expirationDate,
    }, config.JWT_SECRET ? config.JWT_SECRET : 'supertoto');
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
      banner: this.banner,
      articles: this.articles
    };
  }
}

export const User: Model<IUser> = model<IUser>("User", userSchema);