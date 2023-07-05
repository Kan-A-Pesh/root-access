import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointResponse } from "@/endpoint";
import { ProjectUtils, ProjectRole } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.RESPO, // requiredPermission
    async (req: Request) => {
        const workspace = new Workspace(req.project?.name ?? "");

        return new EndpointResponse(200, {
            private: workspace.getSSHPrivateKey(),
            public: workspace.getSSHPublicKey(),
        });
    },
);
