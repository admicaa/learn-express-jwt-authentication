import CustomAPIError from "../../errors/custom-error.js";
import tokensModel from "../models/tokens.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class MainController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomAPIError("Please provide valid email and password", 400);
    }
    var user = await userModel.findOne({ username });
    if (!user) {
      throw new CustomAPIError("Please provide valid email and password", 400);
    }
    var result = await this.comparePassword(password, user.password);
    if (result) {
      const token = jwt.sign(
        {
          username: user.username,
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );
      var tokenExpires = new Date();
      tokenExpires = tokenExpires.setDate(tokenExpires.getDate() + 30);
      var session = await tokensModel.create({
        user_id: user._id,
        jwt: token,
        expires: tokenExpires,
      });
      return res.json({ token, msg: "User Created" });
    } else {
      throw new CustomAPIError("Please provide valid email and password", 400);
    }
  }
  async comparePassword(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
  async hashPassword(password) {
    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    return hashedPassword;
  }
  async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomAPIError("Please provide valid email and password", 400);
    }
    var that = new MainController();
    var hashedPassword = await this.hashPassword(password);
    var user = await userModel.create({
      username,
      password: hashedPassword,
    });

    return res.send({
      message: `Welcome ${username}`,
      user: {
        _id: user._id,
      },
    });
  }
  async dashboard(req, res) {
    return res.json({
      msg: `Hello, ${req.user.username}`,
      secret: `Here is your lucky number ${Math.floor(Math.random() * 101)}`,
    });
  }
}

export default new MainController();
