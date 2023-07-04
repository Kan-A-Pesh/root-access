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

    if (!req.body) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "No settings provided",
            },
        });
    }

    const settings = req.body;
    const defaultSettingsKeys = Settings.listKeys();

    for (const key of Object.keys(settings)) {
        if (!defaultSettingsKeys.includes(key)) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: `Invalid setting key: ${key}`,
                },
            });
        }

        if (typeof settings[key] !== "string") {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: `Invalid setting value for key ${key}`,
                },
            });
        }

        await Settings.set(key, settings[key]);
    }

    res.status(200).json({
        status: "success",
        payload: {
            message: "Settings updated",
        },
    });
};
