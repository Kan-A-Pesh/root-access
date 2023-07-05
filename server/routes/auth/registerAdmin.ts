import { UserRole } from "@/models/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        // Verify root key
        if (!req.body.rootkey) {
            throw new EndpointError(400, "Root key is required");
        }

        if (req.body.rootkey !== process.env.ROOT_KEY) {
            throw new EndpointError(400, "Invalid root key");
        }

        // Verify real name
        if (!req.body.realname) {
            throw new EndpointError(400, "Real name is required");
        }

        if (/^[a-zA-Z -'.]+$/.test(req.body.realname) === false) {
            throw new EndpointError(400, "Invalid real name");
        }

        // Verify email
        if (!req.body.email) {
            throw new EndpointError(400, "Email is required");
        }

        if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/.test(req.body.email) === false) {
            throw new EndpointError(400, "Invalid email");
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
            let content = fs.readFileSync(process.env.EMAIL_TEMPLATE ?? __dirname + "/../../config/mails/welcomePage.html", "utf8");

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

            return new EndpointResponse(200);
        } catch (err) {
            console.error(err);
            throw new EndpointError(500, "Failed to send email");
        }
    },
);
