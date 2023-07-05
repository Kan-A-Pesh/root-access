import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import UserModel, { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    UserRole.ADMIN, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        if (!req.params.handle) {
            throw new EndpointError(400, "Handle is required");
        }

        const user = await UserModel.findOneAndDelete({ handle: req.params.handle });

        if (!user) {
            throw new EndpointError(404, "User not found");
        }

        return new EndpointResponse(200, user);
    },
);
