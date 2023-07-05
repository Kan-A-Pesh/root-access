import Settings from "@/controllers/settings";
import Endpoint, { EndpointResponse } from "@/endpoint";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    UserRole.ADMIN, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        const settings = await Settings.getAll();
        return new EndpointResponse(200, settings);
    },
);
