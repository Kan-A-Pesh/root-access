import Endpoint, { EndpointResponse } from "@/endpoint";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        return new EndpointResponse(200, req.project?.proxyAliases);
    },
);
