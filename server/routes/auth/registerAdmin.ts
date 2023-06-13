import { UserRole } from "@/models/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";

export default (req: Request, res: Response) => {
    // Verify root key
    if (!req.body.rootkey) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "Missing root key",
            },
        });
    }

    if (req.body.rootkey !== process.env.ROOT_KEY) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "Invalid root key",
            },
        });
    }

    // Verify real name
    if (!req.body.realname) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Missing real name",
            },
        });
    }

    if (/^[a-zA-Z -'.]+$/.test(req.body.realname) === false) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid real name",
            },
        });
    }

    // Verify email
    if (!req.body.email) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Missing email",
            },
        });
    }

    if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/.test(req.body.email) === false) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid email",
            },
        });
    }

    const token = jwt.sign(
        {
            realname: req.body.realname,
            email: req.body.email,
            role: UserRole.ADMIN,
        },
        process.env.JWT_SECRET ?? "",
        {
            expiresIn: "1 day",
        },
    );

    try {
        const config = require("@/config/mails/welcomeConfig.json");
        let content = fs.readFileSync(__dirname + "/../../config/mails/welcomePage.html", "utf8");

        content = content.replaceAll("{{token}}", token);
        content = content.replaceAll("{{name}}", req.body.realname);
        content = content.replaceAll("{{role}}", UserRole.ADMIN);
        content = content.replaceAll("{{email}}", req.body.email);

        nodemailer
            .createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT ?? "587"),
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })
            .sendMail({
                from: config.from,
                to: req.body.email,
                subject: config.subject,
                html: content,
            });

        return res.status(200).json({
            status: "success",
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            payload: {
                message: err,
            },
        });
    }
};
