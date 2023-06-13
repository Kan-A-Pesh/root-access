import SessionModel from "@/models/session";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    await SessionModel.findByIdAndDelete(token).exec();

    return res.status(200).json({ status: "success" });
};
