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

    const user = await UserModel.findOneAndDelete({ handle: req.params.handle });

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
        payload: user,
    });
};
