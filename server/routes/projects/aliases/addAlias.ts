import { Proxy } from "@/controllers/proxy";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        let remote: string[] = [];
        let destination: string = "";
        let destinationType: "path" | "port" = "path";

        // Check alias
        if (!req.body.alias) {
            throw new EndpointError(400, "At least one alias must be provided");
        }

        if (typeof req.body.alias === "string") {
            remote.push(req.body.alias);
        }

        if (Array.isArray(req.body.alias)) {
            remote = req.body.alias;
        }

        for (let alias of remote) {
            // Check if alias is a valid URL (sub.sub.domain.tld)
            if (!alias.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,10}$/)) {
                throw new EndpointError(400, "Invalid alias");
            }
        }

        // Check destination
        if (!req.body.destination) {
            throw new EndpointError(400, "Destination must be provided");
        }

        if (!isNaN(Number(req.body.destination))) {
            let destinationPort = Number(req.body.destination);
            if (destinationPort < 5000 || destinationPort > 50000) {
                throw new EndpointError(400, "Destination port must be between 5000 and 50000");
            }

            destination = req.body.destination;
            destinationType = "port";
        } else {
            if (req.body.destination.includes("..")) {
                throw new EndpointError(400, "Invalid destination");
            }

            destination = "path|" + req.body.destination;
            destinationType = "path";
        }

        // Check if remote already exists
        for (let alias of remote) {
            if (req.project?.proxyAliases.find((a) => a.remoteUrls.includes(alias))) {
                throw new EndpointError(400, "Remote url already exists");
            }
        }

        const aliasId = (req.project?.proxyAliases[req.project?.proxyAliases.length - 1]?.id ?? 0) + 1;

        // Add alias
        req.project?.proxyAliases.push({
            id: aliasId,
            remoteUrls: remote,
            destination: destination,
        });

        // Apply changes
        Proxy.writeProjectAliases(req.project as Project);
        Proxy.applyConfig();

        const project = await ProjectModel.updateOne({ _id: req.project?._id }, { proxyAliases: req.project?.proxyAliases });

        if (!project) {
            throw new EndpointError(500, "Failed to update project");
        }

        return new EndpointResponse(200, {
            message: "Alias added",
            id: aliasId,
            remoteUrls: remote,
            destination: destination,
            destinationType: destinationType,
        });
    },
);
