import tokensModel from "../models/tokens.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("No token", 401);
  }
  var token = authHeader.replace("Bearer ", "");
  var token = await tokensModel.findOne({
    jwt: token,
    expires: { $gt: new Date() },
  });

  if (!token) {
    throw new CustomAPIError("Token Expired", 401);
  }
  try {
    const decoded = jwt.verify(token.jwt, process.env.JWT_SECRET);
    if (decoded._id != token.user_id) {
      throw new CustomAPIError("You are not allowed to access this page", 401);
    }
    req.user = await userModel.findOne({ _id: decoded._id });
    next();
  } catch (error) {
    throw new CustomAPIError("You are not allowed to access this page", 401);
  }
};
export default authenticationMiddleware;
