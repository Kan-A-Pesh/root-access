import * as fs from "fs";
import path from "path";

import { Project } from "@/models/project";
import { randomPassword } from "@/utils/random";
import { execSync } from "child_process";
import { checkSudoPermission } from "@/utils/sudo";

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

        // Generate credentials (for FTP, SSH, etc.)
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
    }

    public delete(): void {
        if (!this.exists()) {
            throw new Error("Workspace does not exist");
        }

        // Delete the workspace directory
        fs.rmdirSync(path.join(getWorkspacesPath(), this.name));

        if (!checkSudoPermission()) {
            throw new Error("Insufficient permissions");
        }

        // Delete the user for SSH
        execSync(`userdel ${this.name}`);
    }

    public getRoot(): string {
        if (!this.exists()) {
            throw new Error("Workspace does not exist");
        }

        return path.join(getWorkspacesPath(), this.name);
    }

    // Generate a workspace from a project
    public static fromProject(project: Project): Workspace {
        return new Workspace(project.name, project.password);
    }

    // Generate a mock workspace from a name
    public static fromName(name: string): Workspace {
        return new Workspace(name);
    }
}
