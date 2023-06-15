import * as dotenv from "dotenv";
import mongoose from "mongoose";
import express, { Express } from "express";
import cors from "cors";
import path from "path";
import { FtpServer } from "ftpd";

import Workspace, { getWorkspacesPath } from "@/controllers/workspace";
import ProjectModel, { Project } from "@/models/project";
import { checkSudoPermission } from "./utils/sudo";

async function main() {
    // Environment variables
    dotenv.config({ path: __dirname + "/../.env" });

    // Check permissions
    if (!checkSudoPermission()) {
        console.log("\x1b[31m[🛑 SYST]:\x1b[33m Insufficient permissions\x1b[0m");
        return process.exit(1);
    }

    // Database (MongoDB)
    mongoose.connect(process.env.MONGO_URI as string);

    // FTP Server (FTPd)
    const ftpServer = new FtpServer("0.0.0.0", {
        getInitialCwd: (connection) => {
            return path.join(getWorkspacesPath(), connection.username);
        },
        getRoot: (connection) => {
            return path.join(getWorkspacesPath(), connection.username);
        },
        pasvPortRangeStart: process.env.PASV_PORT_RANGE_START as unknown as number,
        pasvPortRangeEnd: process.env.PASV_PORT_RANGE_END as unknown as number,
    });

    ftpServer.on("error", (error) => {
        console.log(`\x1b[35m[🔥 FTPD]:\x1b[31m ${error}\x1b[0m`);
    });

    ftpServer.on("client:connected", (connection) => {
        var workspace: Workspace | null = null;
        console.log(`\x1b[35m[🔥 FTPD]:\x1b[32m Client connected: ${connection.remoteAddress}\x1b[0m`);

        // Username authentication
        connection.on("command:user", async (user: string, success: () => void, failure: () => void) => {
            if (!user) return failure();

            const project = await ProjectModel.findOne({ name: user });
            if (!project) return failure();

            workspace = Workspace.fromProject(project);
            if (!workspace.exists()) return failure();

            return success();
        });

        // Password authentication
        connection.on("command:pass", async (pass: string, success: (user: string) => void, failure: () => void) => {
            if (!pass) return failure();
            if (!workspace) return failure();
            if (pass != workspace.password) return failure();

            return success(workspace.name);
        });
    });

    ftpServer.debugging = 4;
    ftpServer.listen((process.env.FTP_PORT as unknown as number) || 21);
    console.log(`\x1b[35m[🔥 FTPD]:\x1b[32m Server is running at ftp://localhost:${process.env.FTP_PORT || 21}\x1b[0m`);

    // HTTP Server (Express)
    const app: Express = express();
    if (process.env.ENV == "dev") {
        console.log("\x1b[33m[⚡ SERV]:\x1b[31m Running in development mode. CORS enabled.\x1b[0m");
        app.use(cors());
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //app.use(express.static(__dirname + "/../public"));

    app.use("*", (req, res, next) => {
        console.log(`\x1b[33m[⚡ SERV]:\x1b[36m ${req.method} ${req.baseUrl} \x1b[37m(${req.ip})\x1b[0m`);
        next();
    });

    app.use("/api", require("./routes/index").default);

    app.listen(process.env.PORT, () => {
        console.log(`\x1b[33m[⚡ SERV]:\x1b[32m Server is running at http://localhost:${process.env.PORT}\x1b[0m`);
    });
}

main().catch((err) => {
    console.error(err);
});
