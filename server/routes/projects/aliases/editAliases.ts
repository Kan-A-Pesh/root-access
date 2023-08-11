import { Proxy } from "@/controllers/proxy";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        // Check alias
        if (!req.body.aliases) {
            throw new EndpointError(400, "At least one alias must be provided");
        }

        for (let alias of req.body.aliases) {
            for (let remoteUrl of alias.remoteUrls) {
                // Check if alias is a valid URL (sub.sub.domain.tld)
                if (!remoteUrl.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,10}$/)) {
                    throw new EndpointError(400, "Invalid alias");
                }
            }
        }

        // Update project aliases (only remoteUrls with id)
        req.project!.proxyAliases = req.project!.proxyAliases.map((alias) => {
            let newAlias = req.body.aliases.find((a: any) => a.id === alias.id);
            if (newAlias) {
                alias.remoteUrls = newAlias.remoteUrls;
            }

            return alias;
        });

        // Apply changes
        Proxy.writeProjectAliases(req.project!);
        Proxy.applyConfig();

        // Update project
        const project = await ProjectModel.updateOne({ _id: req.project!._id }, { proxyAliases: req.project!.proxyAliases });

        if (!project) {
            throw new EndpointError(500, "Failed to update project");
        }

        return new EndpointResponse(200, req.project!.proxyAliases);
    },
);
