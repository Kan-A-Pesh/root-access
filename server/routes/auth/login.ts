import { verifyPassword } from "@/utils/cypher";
import UserModel from "@/models/user";
import { Request, Response } from "express";
import SessionModel from "@/models/session";
import { randomUUID } from "@/utils/random";

export default async (req: Request, res: Response) => {
    // Check handle
    if (!req.body.handle) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Handle is required",
            },
        });
    }

    // Check password
    if (!req.body.password) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Password is required",
            },
        });
    }

    // Find user
    const user = await UserModel.findOne({
        handle: req.body.handle,
    });

    if (!user) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid handle or password",
            },
        });
    }

    // Check password
    if ((await verifyPassword(req.body.password, user.passhash)) === false) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid handle or password",
            },
        });
    }

    // Create session
    const session = await SessionModel.create({
        _id: randomUUID(),
        userId: user._id,
    });

    // Send token
    return res.status(200).json({
        status: "success",
        payload: {
            token: session._id,
        },
    });
};
