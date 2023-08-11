import RootConfig from "@/models/rootConfig";
import Workspace from "./workspace";
import { ExecSyncOptions, execSync } from "child_process";
import ProjectModel from "@/models/project";
import { Proxy } from "./proxy";
import path from "path";

export default class Service {
    private workspace: Workspace;
    private rootConfig: RootConfig;

    constructor(workspace: Workspace, rootConfig: RootConfig) {
        this.workspace = workspace;
        this.rootConfig = rootConfig;
    }

    public static async exists(workspace: Workspace): Promise<string> {
        try {
            await RootConfig.fromWorkspace(workspace);
            return "";
        } catch (error: any) {
            return error.message;
        }
    }

    public static async fromWorkspace(workspace: Workspace): Promise<Service> {
        const rootConfig = await RootConfig.fromWorkspace(workspace);
        return new Service(workspace, rootConfig);
    }

    /**
     * Generate a random port number (between 2000 and 65000)
     */
    public randomPort(): number {
        return Math.floor(Math.random() * (65000 - 2000 + 1) + 2000);
    }

    public logService(): string {
        const options: ExecSyncOptions = {
            cwd: this.rootConfig.workspacePath,
            encoding: "utf8",
        };

        switch (this.rootConfig.service) {
            case "docker":
                // Get docker container logs
                const containerId = execSync(`docker ps -qf "name=${this.workspace.name}"`, options).toString().trim();
                return execSync(`docker logs ${containerId}`).toString().trim();
            case "docker-compose":
                // Get docker-compose logs
                return execSync(`docker compose -f ${path.join(this.rootConfig.workspacePath, this.rootConfig.path)} logs`, options)
                    .toString()
                    .trim();
            case "web-static":
                // Nothing to do
                return "Service is running";
            default:
                throw new Error(`Unknown service type: ${this.rootConfig.service}`);
        }
    }

    public async status(): Promise<boolean> {
        const options: ExecSyncOptions = {
            cwd: this.rootConfig.workspacePath,
            encoding: "utf8",
        };

        switch (this.rootConfig.service) {
            case "docker":
                // Get docker container status
                const containerId = execSync(`docker ps -qf "name=${this.workspace.name}"`, options).toString().trim();
                return containerId !== "";
            case "docker-compose":
                // Get docker-compose status
                let status = false;
                try {
                    status =
                        execSync(`docker compose -f ${path.join(this.rootConfig.workspacePath, this.rootConfig.path)} ps -q`, options)
                            .toString()
                            .trim() !== "";
                } catch (error: any) {
                    return false;
                }
                return status;
            case "web-static":
                // Nothing to do
                return true;
            default:
                throw new Error(`Unknown service type: ${this.rootConfig.service}`);
        }
    }

    public async startService(): Promise<void> {
        // Generate ports
        const ports: {
            [key: string]: {
                port: number;
                env_name: string;
                exposed: boolean;
                force: number;
                proxy: string;
            };
        } = {};

        for (const configPortKey in this.rootConfig.ports) {
            const configPort = this.rootConfig.ports[configPortKey];

            if (configPort.force) {
                ports[configPortKey] = { ...configPort, port: configPort.force };
                continue;
            }

            ports[configPortKey] = { ...configPort, port: this.randomPort() };
        }

        const options: ExecSyncOptions = {
            cwd: this.rootConfig.workspacePath,
            encoding: "utf8",
        };

        // Start the service
        switch (this.rootConfig.service) {
            case "docker":
                // Not implemented
                throw new Error("Docker service is not implemented yet");
            case "docker-compose":
                // Generate environment variables
                let envVars = "";
                for (const portKey in ports) {
                    envVars += `${ports[portKey].env_name}=${ports[portKey].port} `;
                }

                // Run docker-compose
                execSync(`${envVars}docker compose -f ${path.join(this.rootConfig.workspacePath, this.rootConfig.path)} up -d`, options);
                break;
            case "web-static":
                // Nothing to do
                break;
            default:
                throw new Error(`Unknown service type: ${this.rootConfig.service}`);
        }

        // Add ports to workspace
        const project = await ProjectModel.findOne({ name: this.workspace.name });
        if (!project) throw new Error("Project not found");

        let proxyAliases = [];
        let portKeys = Object.keys(this.rootConfig.ports);

        for (let i = 0; i < portKeys.length; i++) {
            const dest = "service|" + portKeys[i] + "|" + ports[portKeys[i]].port;

            // Check if destination is already in proxyAliases
            const alias = project.proxyAliases.find((a) => a.destination === dest);
            if (alias) {
                alias.id = i;
                proxyAliases.push(alias);
                continue;
            }

            // Check if port is exposed
            if (!ports[portKeys[i]].exposed) continue;

            // Add alias
            proxyAliases.push({
                id: i,
                remoteUrls: ["example.com"],
                destination: dest,
            });
        }

        // Save ports to project
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { name: this.workspace.name },
            { proxyAliases: proxyAliases },
            { new: true },
        );
        if (!updatedProject) throw new Error("Failed to update project");

        // Apply config
        Proxy.writeProjectAliases(updatedProject);
        Proxy.applyConfig();
    }

    public async stopService(): Promise<void> {
        const options: ExecSyncOptions = {
            cwd: this.rootConfig.workspacePath,
            encoding: "utf8",
        };

        switch (this.rootConfig.service) {
            case "docker":
                // Not implemented
                throw new Error("Docker service is not implemented yet");
            case "docker-compose":
                // Run docker-compose
                execSync(`docker compose -f ${this.rootConfig.path} down`, options);
                break;
            case "web-static":
                // Nothing to do
                break;
            default:
                throw new Error(`Unknown service type: ${this.rootConfig.service}`);
        }
    }

    public async restartService(): Promise<void> {
        await this.stopService();
        await this.startService();
    }
}
