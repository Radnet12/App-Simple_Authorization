// Modules
const jwt = require("jsonwebtoken");

// Keys
const { secret } = require("../config");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res
                .status(403)
                .json({ message: "Пользователь не авторизован!" });
        }

        const decodedDataFromToken = jwt.verify(token, secret);

        req.user = decodedDataFromToken;

        next();
    } catch (e) {
        console.log(e);
        return res
            .status(403)
            .json({ message: "Пользователь не авторизован!" });
    }
};
