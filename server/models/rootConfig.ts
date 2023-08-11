import Settings from "@/controllers/settings";
import Workspace from "@/controllers/workspace";
import * as fs from "fs";
import yaml from "js-yaml";
import path from "path";

export default class RootConfig {
    public workspacePath: string = "";
    public service: string = "";
    public path: string = "";
    public ports: {
        [key: string]: {
            env_name: string;
            exposed: boolean;
            force: number;
            proxy: string;
        };
    } = {};

    public static async fromWorkspace(workspace: Workspace): Promise<RootConfig> {
        let file = path.join(workspace.getRoot(), await Settings.get("repo.configFile"));
        let workspacePath = workspace.getRoot();

        // Check if file exists
        if (!fs.existsSync(file)) {
            file = path.join(workspace.getRoot(), await Settings.get("repo.folderName"), await Settings.get("repo.configFile"));
            workspacePath = path.join(workspace.getRoot(), await Settings.get("repo.folderName"));

            if (!fs.existsSync(file)) {
                throw new Error("Root config file not found");
            }
        }

        // Load file (yaml)
        const config: any = yaml.load(fs.readFileSync(file, "utf8"));
        const rootConfig = new RootConfig();
        rootConfig.workspacePath = workspacePath;

        // Parse config
        // Service
        if (!config.service) throw new Error("Root config file does not contain a service name");

        if (["docker", "docker-compose", "web-static"].indexOf(config.service) === -1)
            throw new Error("Root config file contains an invalid service name");

        rootConfig.service = config.service;

        // Path
        rootConfig.path = config.path;
        if (!rootConfig.path) {
            switch (rootConfig.service) {
                case "docker":
                    rootConfig.path = "/Dockerfile";
                    break;
                case "docker-compose":
                    rootConfig.path = "/docker-compose.yml";
                    break;
                case "web-static":
                    rootConfig.path = "/";
                    break;
            }
        }

        // Ports
        if (!config.ports) throw new Error("Root config file does not contain any ports");

        for (const portName in config.ports) {
            const portValue = config.ports[portName];

            if (!portValue.env_name) throw new Error("Root config file contains an invalid port name");

            rootConfig.ports[portName] = {
                env_name: portValue.env_name,
                exposed: portValue.exposed || false,
                force: portValue.force || 0,
                proxy: portValue.proxy || "",
            };
        }

        return rootConfig;
    }
}
