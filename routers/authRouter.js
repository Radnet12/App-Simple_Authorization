// Modules
const Router = require("express");
const { check } = require("express-validator");

// Middlewares
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const RoleMiddleware = require("../middlewares/RoleMiddleware");

// Creating new instance for router
const AuthRouter = new Router();

// Getting authcontroller for routes
const AuthController = require("../controllers/AuthController");

// Defining routes and binging controller functions with middlewares
AuthRouter.post(
    "/registration",
    [
        check("username", "Имя пользователя не может быть пустым").notEmpty(),
        check("password", "Пароль не может быть меньше 5 символов").isLength({
            min: 5,
        }),
    ],
    AuthController.registration
);
AuthRouter.post("/login", AuthController.login);
AuthRouter.get("/users", RoleMiddleware(["ADMIN"]), AuthController.getUsers);

module.exports = AuthRouter;
