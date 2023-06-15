import { Proxy } from "@/controllers/proxy";
import ProjectModel, { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.CHIEF)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to add aliases to this project",
            },
        });
    }

    let remote: string[] = [];
    let destination: string = "";
    let destinationType: "path" | "port" = "path";

    // Check alias
    if (!req.body.alias) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "At least one alias must be provided",
            },
        });
    }

    if (typeof req.body.alias === "string") {
        remote.push(req.body.alias);
    }

    if (Array.isArray(req.body.alias)) {
        remote = req.body.alias;
    }

    for (let alias of remote) {
        // Check if alias is a valid URL (sub.sub.domain.tld)
        if (!alias.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/)) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid alias",
                    alias: alias,
                },
            });
        }
    }

    // Check destination
    if (!req.body.destination) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Destination must be provided",
            },
        });
    }

    if (!isNaN(Number(req.body.destination))) {
        let destinationPort = Number(req.body.destination);
        if (destinationPort < 1 || destinationPort > 65535) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Destination port must be between 1 and 65535",
                },
            });
        }

        destination = req.body.destination;
        destinationType = "port";
    } else {
        if (req.body.destination.includes("..")) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid destination",
                    destination: req.body.destination,
                },
            });
        }

        destination = req.body.destination;
        destinationType = "path";
    }

    // Check if remote already exists
    for (let alias of remote) {
        if (req.project?.proxyAliases.find((a) => a.remoteUrls.includes(alias))) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Remote url already exists",
                    remote: alias,
                },
            });
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

    const project = ProjectModel.updateOne({ _id: req.project?._id }, { proxyAliases: req.project?.proxyAliases });

    if (!project) {
        return res.status(500).json({
            status: "error",
            payload: {
                message: "Failed to update project",
            },
        });
    }

    return res.status(200).json({
        status: "success",
        payload: {
            message: "Alias added",
            id: aliasId,
            remoteUrls: remote,
            destination: destination,
            destinationType: destinationType,
        },
    });
};
