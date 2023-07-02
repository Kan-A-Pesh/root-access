import UserModel from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    let permissions = req.project?.permissions;

    if (!permissions) {
        return res.status(404).json({
            status: "error",
            message: "Permissions not found",
        });
    }

    permissions = await Promise.all(
        permissions?.map(async (permission) => {
            const user = await UserModel.findById(permission.userId);

            if (!user) {
                return {
                    ...permission,
                    user: null,
                };
            }

            return {
                ...permission,
                user: {
                    handle: user.handle,
                    realname: user.realname,
                    role: user.role,
                },
            };
        }),
    );

    res.status(200).json({
        status: "success",
        payload: permissions,
    });
};
