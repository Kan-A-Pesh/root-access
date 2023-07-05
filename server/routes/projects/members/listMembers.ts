import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import UserModel from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        let permissions = req.project?.permissions;

        if (!permissions) {
            throw new EndpointError(404, "Permissions not found");
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

        return new EndpointResponse(200, permissions);
    },
);
