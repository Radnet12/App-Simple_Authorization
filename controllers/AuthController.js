// Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Schemas
const User = require("../models/User");
const Role = require("../models/Role");

// Validation
const { validationResult } = require("express-validator");

// Keys
const { secret } = require("../config");

const generateAccessToken = (id, roles) => {
    let payload = { id, roles };

    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class AuthController {
    async registration(req, res) {
        try {
            // Checking if there are errors in data from middleware in route
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при регистрации!", errors });
            }

            // Getting data from request
            const { username, password } = req.body;

            // Checking if current username are in DB or no
            const user = await User.findOne({ username });

            // If such user exist returning error
            if (user) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует!",
                });
            }

            // 1) Hashing password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // 2) Getting roles from DB
            const userRoles = await Role.findOne({ value: "USER" });

            // 3) Creating new user
            const newUser = new User({
                username,
                password: hashedPassword,
                roles: [userRoles.value],
            });

            // 4) Saving new user to DB
            await newUser.save();

            // 5) Returning message to the front
            return res.json("Пользователь был успешно зарегестрирован!");
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Ошибка при регистрации!" });
        }
    }

    async login(req, res) {
        try {
            // Getting data from request
            const { username, password } = req.body;

            // Checking if current username are in DB or no
            const user = await User.findOne({ username });

            // If such user does not exist returning error
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `Пользователь ${username} не найден!` });
            }

            // Checking password
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res
                    .status(400)
                    .json({ message: "Введен неверный пароль!" });
            }

            // Generating accesse token
            const token = generateAccessToken(user._id, user.roles);

            return res.json({ token });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Ошибка при логине!" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();

            return res.json({ users });
        } catch (e) {}
    }
}

// Exporting new instance of AuthController
module.exports = new AuthController();
