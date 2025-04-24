import express from "express";
import bookRoutes from "./routes/book.routes.js"
import { PORT } from "./config.js"
import { sequelize } from "./db.js";
import "./models/Book.js";

const app = express();

try {
    app.use(express.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    });
    app.listen(PORT);
    app.use(bookRoutes);

    await sequelize.sync();

    console.log(`Server listening on port ${PORT}`);
} catch (error) {
    console.log(`Ocurrio un error en la inicialización.`)
}


