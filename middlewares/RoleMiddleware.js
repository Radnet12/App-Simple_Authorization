// Modules
const jwt = require("jsonwebtoken");

// Keys
const { secret } = require("../config");

module.exports = (roles) => (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res
                .status(403)
                .json({ message: "Пользователь не авторизован!" });
        }

        const { roles: userRoles } = jwt.verify(token, secret);

        let isUserHasRole = false;

        userRoles.forEach((role) => {
            if (roles.includes(role)) {
                isUserHasRole = true;
            }
        });

        if (!isUserHasRole) {
            return res.status(403).json({ message: "У Вас нет доступа!" });
        }

        next();
    } catch (e) {
        console.log(e);
        return res
            .status(403)
            .json({ message: "Пользователь не авторизован!" });
    }
};
