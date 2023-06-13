import { Request, Response } from "express";
import UserModel from "@/models/user";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/utils/cypher";

export default async (req: Request, res: Response) => {
    // Parse token
    let payload: any;
    try {
        payload = jwt.verify(req.body.token, process.env.JWT_SECRET as string);
    } catch (err) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid token",
            },
        });
    }

    // Verify handle
    if (!req.body.handle) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Missing handle",
            },
        });
    }

    if (/^[a-z0-9_-]+$/.test(req.body.handle) === false) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid handle",
            },
        });
    }

    // Verify password
    if (!req.body.password) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Missing password",
            },
        });
    }

    if (req.body.password.length < 8) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Password too short",
            },
        });
    }

    // Hash password
    const passhash = await hashPassword(req.body.password);

    // Check if user already exists
    const user = await UserModel.findOne({
        $or: [{ handle: req.body.handle }, { email: payload.email }, { realname: payload.realname }],
    });

    if (user) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User already exists",
            },
        });
    }

    // Create user

    const request = await UserModel.create({
        handle: req.body.handle,
        email: payload.email,
        realname: payload.realname,
        passhash: passhash,
        role: payload.role,
        created: new Date(),
        lastLogin: new Date(),
    });

    if (!request) {
        return res.status(500).json({
            status: "error",
            payload: {
                message: "Failed to create user",
            },
        });
    }

    // Send response
    return res.status(200).json({
        status: "success",
        payload: {
            message: "User created",
            id: request._id,
        },
    });
};
