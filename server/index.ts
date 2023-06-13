import * as dotenv from "dotenv";
import mongoose from "mongoose";
import express, { Express } from "express";
import cors from "cors";

async function main() {
    dotenv.config({ path: __dirname + "/../.env" });

    mongoose.connect(process.env.MONGO_URI as string);

    const app: Express = express();
    if (process.env.ENV == "dev") {
        console.log("[⚡ SERV]: Running in development mode. CORS enabled.");
        app.use(cors());
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //app.use(express.static(__dirname + "/../public"));

    app.use("/api", require("./routes/index").default);

    app.listen(process.env.PORT, () => {
        console.log(`[⚡ SERV]: Server is running at http://localhost:${process.env.PORT}`);
    });
}

main().catch((err) => {
    console.error(err);
});
