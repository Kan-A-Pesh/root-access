import path from "path";
import { getWorkspacesPath } from "./workspace";
import { Project } from "@/models/project";
import * as fs from "fs";
import { exec, execSync } from "child_process";

export class Alias {
    public remoteUrls: string[] = [];
    public destination: string = "";

    public constructor(remoteUrls: string[], destination: string) {
        this.remoteUrls = remoteUrls;
        this.destination = destination;
    }

    public toNginxConfig(project: Project): string {
        let config: string = "";

        // Check if destination is a path or a port
        if (!isNaN(Number(this.destination))) {
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
        } else {
            config += `
                root ${path.join(getWorkspacesPath(), project.name, this.destination)};
                index index.php index.html index.htm;

                location / {
                    try_files $uri $uri/ /index.php?$query_string;
                }

                location ~ \.php$ {
                    include snippets/fastcgi-php.conf;
                    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
                }
                
                location ~ /\.ht {
                    deny all;
                }
            `;
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

    public static writeProjectAliases(project: Project): void {
        fs.writeFileSync(
            path.join(process.env.NGINX_SITES_PATH ?? "/etc/nginx/sites-enabled", `${project.name}.conf`),
            this.toNginxConfig(project),
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

    public static toNginxConfig(project: Project): string {
        let config: string = "";

        for (const alias of this.getProjectAliases(project)) {
            config += alias.toNginxConfig(project);
        }

        return config;
    }
}
