import { Component, Show, createSignal } from "solid-js";

const RepoCard: Component<{
    repo: string | null;
    editRepo: boolean;
    projectId: string;
}> = ({ repo, editRepo, projectId }) => {
    const [repoName, setRepoName] = createSignal<string>(repo ?? "");

    return (
        <div class="card">
            <h2 class="text-title">// GITHUB REPO</h2>
            <Show when={editRepo}>
                <input
                    type="text"
                    class="form-element"
                    placeholder="Repo name"
                    value={repoName()}
                    onInput={(e) => {
                        setRepoName(e.currentTarget.value);
                    }}
                />
                <button
                    class="btn btn-primary"
                    onClick={() => {
                        alert("Not implemented");
                    }}
                >
                    Save
                </button>
            </Show>
            <a href={repoName()} target="_blank" rel="noreferrer">
                <p>{repoName()}</p>
            </a>
            <br />
            <p class="text-role">Integration (WIP)</p>
            <p>
                Status: <span class="error">{"N/A"}</span>
            </p>
            <p class="text-handle">Branch {"N/A"}</p>
            <p class="text-handle">Service: {"N/A"}</p>
            <p class="text-handle">Aliases detected: {"N/A"}</p>
            <p class="text-handle">Last updated: {"N/A"}</p>
        </div>
    );
};

export default RepoCard;
