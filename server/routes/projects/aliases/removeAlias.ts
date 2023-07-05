import { Proxy } from "@/controllers/proxy";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        // Check if alias id exists
        if (req.project?.proxyAliases.find((alias) => alias.id === Number(req.params.alias_id)) === undefined) {
            throw new EndpointError(400, "Alias id not found");
        }

        // Remove alias
        req.project.proxyAliases = req.project.proxyAliases.filter((alias) => alias.id !== Number(req.params.alias_id));

        // Apply changes
        Proxy.writeProjectAliases(req.project as Project);
        Proxy.applyConfig();

        const project = await ProjectModel.updateOne({ _id: req.project._id }, { proxyAliases: req.project.proxyAliases });

        if (!project) {
            throw new EndpointError(500, "Failed to update project");
        }

        return new EndpointResponse(200, "Alias removed");
    },
);
