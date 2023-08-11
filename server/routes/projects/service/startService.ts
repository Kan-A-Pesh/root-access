import Service from "@/controllers/service";
import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import { ProjectRole } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        const err = await Service.exists(Workspace.fromProject(req.project!));
        if (err) throw new EndpointError(400, err);

        const service = await Service.fromWorkspace(Workspace.fromProject(req.project!));

        await service.startService();
        return new EndpointResponse(200, "Service started");
    },
);
