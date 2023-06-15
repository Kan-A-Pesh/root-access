import * as fs from "fs";
import path from "path";

import { Project } from "@/models/project";
import { randomPassword } from "@/utils/random";
import { exec, execSync } from "child_process";
import { checkSudoPermission } from "@/utils/sudo";
import { Proxy } from "./proxy";

export const getWorkspacesPath: () => string = () => {
    return process.env.WORKSPACES_ROOT ?? "/workspaces";
};

export default class Workspace {
    public name: string = "";
    public password: string = "";

    public constructor(name: string, password?: string) {
        this.name = name;
        this.password = password ?? "";
    }

    public exists(): boolean {
        return fs.existsSync(path.join(getWorkspacesPath(), this.name));
    }

    public create(): void {
        if (this.exists()) {
            throw new Error("Workspace already exists");
        }

        // Create the workspace directory
        fs.mkdirSync(path.join(getWorkspacesPath(), this.name));

        // Create a README.md file
        fs.writeFileSync(
            path.join(getWorkspacesPath(), this.name, "README.md"),
            `# ${this.name}\n\n` + `Welcome to your new workspace 🎉!`,
        );

        // Generate a random password (for FTP)
        this.password = randomPassword();

        if (!checkSudoPermission()) {
            throw new Error("Insufficient permissions");
        }

        // Create a user for SSH
        execSync(`useradd -m -d ${path.join(getWorkspacesPath(), this.name)} -s /bin/bash ${this.name}`);
        execSync(`echo "${this.name}:${this.password}" | chpasswd`);

        // Change the owner and permissions of the workspace directory
        execSync(`chown -R ${this.name}:${this.name} ${path.join(getWorkspacesPath(), this.name)}`);
        execSync(`chmod -R 755 ${path.join(getWorkspacesPath(), this.name)}`);

        // Generate an SSH key
        execSync(`ssh-keygen -t rsa -b 4096 -f ${path.join(getWorkspacesPath(), this.name, ".ssh", "id_rsa")} -q -N ""`);
        execSync(
            `cp ${path.join(getWorkspacesPath(), this.name, ".ssh", "id_rsa.pub")} ${path.join(
                getWorkspacesPath(),
                this.name,
                ".ssh",
                "authorized_keys",
            )}`,
        );

        execSync(`chown -R ${this.name}:${this.name} ${path.join(getWorkspacesPath(), this.name, ".ssh")}`);
        execSync(`chmod -R 700 ${path.join(getWorkspacesPath(), this.name, ".ssh")}`);
    }

    public delete(): void {
        if (!this.exists()) {
            throw new Error("Workspace does not exist");
        }

        if (!checkSudoPermission()) {
            throw new Error("Insufficient permissions");
        }

        // Delete the user and workspace directory
        fs.rmdirSync(path.join(getWorkspacesPath(), this.name), { recursive: true });
        execSync(`userdel ${this.name} --force`);

        // Remove all WEB aliases
        Proxy.removeProjectAliasesByName(this.name);
        if (!Proxy.applyConfig()) {
            throw new Error("Failed to apply proxy configuration");
        }
    }

    public getRoot(): string {
        if (!this.exists()) {
            throw new Error("Workspace does not exist");
        }

        return path.join(getWorkspacesPath(), this.name);
    }

    public getSSHPrivateKey(): string {
        if (!this.exists()) {
            throw new Error("Workspace does not exist");
        }

        return fs.readFileSync(path.join(getWorkspacesPath(), this.name, ".ssh", "id_rsa")).toString();
    }

    // Generate a workspace from a project
    public static fromProject(project: Project): Workspace {
        return new Workspace(project.name, project.password);
    }

    // Generate a mock workspace from a name
    public static fromName(name: string): Workspace {
        const workspace = new Workspace(name);
        return workspace;
    }
}
