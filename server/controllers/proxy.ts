import path from "path";
import Workspace, { getWorkspacesPath } from "./workspace";
import { Project } from "@/models/project";
import * as fs from "fs";
import { exec, execSync } from "child_process";
import RootConfig from "@/models/rootConfig";

export class Alias {
    public remoteUrls: string[] = [];
    public destination: string = "";

    public constructor(remoteUrls: string[], destination: string) {
        this.remoteUrls = remoteUrls;
        this.destination = destination;
    }

    public toNginxConfig(project: Project, rootConfig: RootConfig): string {
        let config: string = "";

        // Check if destination is the web-static service
        if (this.destination === "service|web-static" && rootConfig.service === "web-static") {
            config = `
                root ${path.join(getWorkspacesPath(), project.name, rootConfig.path.replaceAll("..", ""))};
                index index.html index.htm;

                location / {
                    try_files $uri $uri/ /index.html;
                }
            `;
        }
        // Check if destination is a service
        else if (this.destination.startsWith("service|")) {
            const [service, port] = this.destination.split("|").slice(1);

            if (!Object.keys(rootConfig.ports).includes(service)) {
                throw new Error(`Service "${service}" does not exist`);
            }

            if (isNaN(Number(port))) {
                throw new Error(`Port "${port}" is not a number`);
            }

            if (!rootConfig.ports[service].exposed) {
                throw new Error(`Port "${port}" is not exposed`);
            }

            if (rootConfig.ports[service].proxy !== "") {
                config = rootConfig.ports[service].proxy.replaceAll(
                    new RegExp("\\$port", "gi"), // $port (case insensitive)
                    port,
                );
            } else {
                config = `
                    location / {
                        proxy_pass http://localhost:${port};
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header Host $host;
                        proxy_cache_bypass $http_upgrade;
                    }
                `;
            }
        }
        // Check if destination is a port
        else if (!isNaN(Number(this.destination))) {
            config += `
                    location / {
                        proxy_pass http://localhost:${this.destination};
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header Host $host;
                        proxy_cache_bypass $http_upgrade;
                    }
                `;
        }
        // Check if destination is a path
        else if (this.destination.startsWith("path|")) {
            const destination = this.destination.split("|").slice(1).join("|").replaceAll("..", "");
            config = `
                root ${path.join(getWorkspacesPath(), project.name, destination)};
                index index.html index.htm;

                location / {
                    try_files $uri $uri/ /index.html;
                }
            `;
        }
        // Else, destination is invalid
        else {
            throw new Error(`Invalid destination "${this.destination}"`);
        }

        return `
            server {
                listen 80;
                server_name ${this.remoteUrls.join(" ")};

                ${config}
            }
        `;
    }
}

export class Proxy {
    public static getProjectAliases(project: Project): Alias[] {
        const aliases: Alias[] = [];

        if (project.proxyAliases) {
            for (const alias of project.proxyAliases) {
                aliases.push(new Alias(alias.remoteUrls, alias.destination));
            }
        }

        return aliases;
    }

    public static async writeProjectAliases(project: Project): Promise<void> {
        fs.writeFileSync(
            path.join(process.env.NGINX_SITES_PATH ?? "/etc/nginx/sites-enabled", `${project.name}.conf`),
            await this.toNginxConfig(project),
        );
    }

    public static removeProjectAliases(project: Project): void {
        Proxy.removeProjectAliasesByName(project.name);
    }

    public static removeProjectAliasesByName(projectName: string): void {
        fs.unlinkSync(path.join(process.env.NGINX_SITES_PATH ?? "/etc/nginx/sites-enabled", `${projectName}.conf`));
    }

    public static applyConfig(): boolean {
        return execSync("nginx -s reload").toString().trim() === "";
    }

    public static async toNginxConfig(project: Project): Promise<string> {
        let config: string = "";

        const rootConfig = await RootConfig.fromWorkspace(Workspace.fromProject(project));

        for (const alias of this.getProjectAliases(project)) {
            config += alias.toNginxConfig(project, rootConfig);
        }

        return config;
    }
}
