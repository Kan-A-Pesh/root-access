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

        const rootPath = path.join(getWorkspacesPath(), this.name);

        // Create the workspace directory
        fs.mkdirSync(rootPath);

        // Create a README.md file
        fs.writeFileSync(path.join(rootPath, "README.md"), `# ${this.name}\n\n` + `Welcome to your new workspace 🎉!`);

        // Generate a random password (for FTP)
        this.password = randomPassword();

        if (!checkSudoPermission()) {
            throw new Error("Insufficient permissions");
        }

        // Create a user for SSH
        execSync(`useradd -m -d ${path.join(rootPath)} -s /bin/bash ${this.name}`);
        execSync(`echo "${this.name}:${this.password}" | chpasswd`);

        // Change the owner and permissions of the workspace directory
        execSync(`chown -R ${this.name}:${this.name} ${path.join(rootPath)}`);
        execSync(`chmod -R 700 ${path.join(rootPath)}`);

        // Generate an SSH key
        fs.mkdirSync(path.join(rootPath, ".ssh"));
        // RSA execSync(`ssh-keygen -t rsa -b 4096 -f ${path.join(rootPath, ".ssh", "id_ed25519")} -q -N ""`);
        execSync(`ssh-keygen -o -a 100 -t ed25519 -f ${path.join(rootPath, ".ssh", "id_ed25519")} -q -N "" -C "${this.name}"`);
        execSync(
            `cp ${path.join(rootPath, ".ssh", "id_ed25519.pub")} ${path.join(getWorkspacesPath(), this.name, ".ssh", "authorized_keys")}`,
        );

        execSync(`chown -R ${this.name}:${this.name} ${path.join(rootPath, ".ssh")}`);
        execSync(`chmod -R 700 ${path.join(rootPath, ".ssh")}`);
        execSync(`chmod 600 ${path.join(rootPath, ".ssh", "id_ed25519")}`);
    }

    public delete(): void {
        if (!checkSudoPermission()) {
            throw new Error("Insufficient permissions");
        }

        // Delete the user and workspace directory
        fs.rmdirSync(path.join(this.getRoot()), { recursive: true });
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
        return fs.readFileSync(path.join(this.getRoot(), ".ssh", "id_ed25519")).toString();
    }

    public getSSHPublicKey(): string {
        return fs.readFileSync(path.join(this.getRoot(), ".ssh", "id_ed25519.pub")).toString();
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
