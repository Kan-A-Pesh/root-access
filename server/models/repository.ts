class Repository {
    public name: string;
    public owner: string;

    constructor(name: string, owner: string) {
        const regex = new RegExp("^[a-zA-Z0-9-_.]+$");

        if (!regex.test(name)) {
            throw new Error("Invalid repository name");
        }

        if (!regex.test(owner)) {
            throw new Error("Invalid repository owner");
        }

        this.name = name;
        this.owner = owner;
    }
}

export default Repository;
