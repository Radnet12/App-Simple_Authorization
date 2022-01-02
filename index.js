// Init dotEnv
require("dotenv").config();

// Getting express and mongoose
const express = require("express");
const mongoose = require("mongoose");

// Getting routes
const AuthRouter = require("./routers/authRouter");

const PORT = process.env.PORT || 5000;

// Init express
const app = express();

// Adding middleware for parsing json from DB
app.use(express.json());

// Adding middleware for auth routing
app.use("/auth", AuthRouter);


// Function for creating connection to db and creating server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => {
            console.log(`Сервер запущен! Порт=${PORT}`);
        });
    } catch (e) {
        console.log("Произошла ошибка при запуске!");
    }
};

startServer();
