import UserModel from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    const userModels = await UserModel.find({});

    // Remove passhash
    const users = userModels.map((user) => {
        const { passhash, ...rest } = user.toObject();
        return rest;
    });

    return res.status(200).json({
        status: "success",
        payload: users,
    });
};
