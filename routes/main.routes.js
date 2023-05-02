import { Router } from "express";
import mianController from "../app/controllers/mian.controller.js";
import authenticationMiddleware from "../app/middleware/auth.js";
// import all controllers
// import SessionController from './app/controllers/SessionController';

const routes = new Router();

// Add routes
// routes.get('/', SessionController.store);

routes.post("/login", mianController.login);

routes.get("/dashboard", authenticationMiddleware, mianController.dashboard);
routes.post("/register", mianController.register);

export default routes;
