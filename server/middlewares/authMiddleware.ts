import { Request, Response, NextFunction } from "express";

import SessionModel from "@/models/session";
import UserModel from "@/models/user";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    // Verify token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: "error",
            payload: {
                message: "No token provided",
            },
        });
    }

    // Decode and find session
    const session = await SessionModel.findByIdAndUpdate(token, { lastUsed: new Date() }, { new: false }).exec();

    if (!session) {
        return res.status(401).json({
            status: "error",
            payload: {
                message: "Invalid token",
            },
        });
    }

    // Check if token is expired
    // TODO: make this configurable
    // NOTE: the expiration time is 7 days
    if (session.lastUsed.getTime() + 1000 * 60 * 60 * 24 * 7 < Date.now()) {
        await session.deleteOne();

        return res.status(401).json({
            status: "error",
            payload: {
                message: "Token expired",
            },
        });
    }

    // Get user from id
    const user = await UserModel.findById(session.userId).exec();

    if (!user) {
        return res.status(401).json({
            status: "error",
            payload: {
                message: "Invalid token",
            },
        });
    }

    // Add user to request
    req.user = user.toObject();

    next();
};
