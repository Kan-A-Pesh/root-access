import UserModel from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (!req.params.handle) {
        return res.status(200).json({
            status: "success",
            payload: req.user,
        });
    }

    const userModel = await UserModel.findOne({ handle: req.params.handle });

    if (!userModel) {
        return res.status(404).json({
            status: "error",
            payload: {
                message: "User not found",
            },
        });
    }

    // Remove passhash
    const { passhash, ...user } = userModel.toObject();

    return res.status(200).json({
        status: "success",
        payload: user,
    });
};
