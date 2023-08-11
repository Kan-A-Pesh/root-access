import Github from "@/controllers/github";
import Endpoint, { EndpointResponse } from "@/endpoint";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    UserRole.RESPO, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        try {
            const githubAgent = await Github.create();
            const repos = await githubAgent.listRepos();
            return new EndpointResponse(200, repos);
        } catch (err: any) {
            return new EndpointResponse(500, err.message);
        }
    },
);
