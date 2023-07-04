import Settings from "@/controllers/settings";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (req.user?.role !== UserRole.ADMIN) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "You do not have permission to do that",
            },
        });
    }

    const settings = await Settings.getAll();

    res.status(200).json({
        status: "success",
        payload: settings,
    });
};
