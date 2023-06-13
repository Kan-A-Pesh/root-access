import UserModel, { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (req.user?.role !== UserRole.ADMIN) {
        return res.status(401).json({
            status: "error",
            payload: {
                message: "Unauthorized",
            },
        });
    }

    if (!req.params.handle) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Handle is required",
            },
        });
    }

    if (!req.body.role || !Object.values(UserRole).includes(req.body.role)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Missing or invalid role",
                sentPayload: req.body,
            },
        });
    }

    if (req.user?.handle === req.params.handle) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Cannot update your own role",
            },
        });
    }

    // Update user
    const user = await UserModel.findOneAndUpdate({ handle: req.params.handle }, { role: req.body.role }, { new: false });

    if (!user) {
        return res.status(404).json({
            status: "error",
            payload: {
                message: "User not found",
            },
        });
    }

    return res.status(200).json({
        status: "success",
        payload: {
            message: "User updated",
            from: user.role,
            to: req.body.role,
        },
    });
};
