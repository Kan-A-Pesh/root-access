import axios from "axios";
import { Component, For, Show, createSignal } from "solid-js";

const RepoCard: Component<{
    repo: string | null;
    editRepo: boolean;
    projectId: string;
}> = ({ repo, editRepo, projectId }) => {
    const [repositoryList, setRepositoryList] = createSignal<{ name: string; owner: string }[]>([]);
    const [selectedRepo, setSelectedRepo] = createSignal<string>(repo ?? "n/a");
    const [loading, setLoading] = createSignal<boolean>(false);
    const [pullText, setPullText] = createSignal<string>("Pull");

    // Get repos from API
    if (editRepo) {
        axios.get(`/settings/repos`).then((res) => {
            setRepositoryList(res.data.payload);
        });
    }

    return (
        <div
            class="card"
            style={{
                opacity: loading() ? 0.5 : 1,
            }}
        >
            <h2 class="text-title">// GITHUB REPO</h2>
            <Show when={!editRepo}>
                <input type="text" placeholder="root-access/root-access" class="form-element" value={repo || "No repo linked"} disabled />
            </Show>

            <Show when={editRepo}>
                <select class="form-element" value={selectedRepo()} onInput={(e) => setSelectedRepo((e.target as HTMLSelectElement).value)}>
                    <option value="n/a">No repo linked</option>
                    <For each={repositoryList()}>
                        {(repo) => (
                            <option value={repo.owner + "/" + repo.name} selected={repo.owner + "/" + repo.name === selectedRepo()}>
                                {repo.name} ({repo.owner})
                            </option>
                        )}
                    </For>
                </select>
                <button
                    class="btn btn-primary"
                    classList={{
                        btn: true,
                        "btn-danger": repo != null && selectedRepo() === "n/a",
                        "btn-primary": !(repo != null && selectedRepo() === "n/a"),
                    }}
                    style={{
                        display: (repo != null && selectedRepo() === repo) || (repo == null && selectedRepo() === "n/a") ? "none" : "block",
                    }}
                    onClick={() => {
                        if (loading()) return;
                        setLoading(true);

                        if (selectedRepo() === "n/a") {
                            axios
                                .delete(`/projects/${projectId}/repo`)
                                .then((res) => {
                                    window.location.reload();
                                })
                                .catch((err) => {
                                    console.error(err);
                                    alert(
                                        "Something went wrong!\nErr: " + err.response.data.payload.message ??
                                            err.message ??
                                            "Unknown error",
                                    );
                                    setLoading(false);
                                });
                            return;
                        }

                        axios
                            .post(`/projects/${projectId}/repo`, {
                                repo: {
                                    owner: selectedRepo().split("/")[0],
                                    name: selectedRepo().split("/")[1],
                                },
                            })
                            .then((res) => {
                                window.location.reload();
                            })
                            .catch((err) => {
                                console.error(err);
                                alert("Something went wrong!\nErr: " + err.response.data.payload.message ?? err.message ?? "Unknown error");
                                setLoading(false);
                            });
                    }}
                >
                    {loading()
                        ? "Loading..."
                        : repo != null
                        ? // If repo WAS linked
                          selectedRepo() === "n/a"
                            ? // If selection is NONE
                              "Delete and unlink repo"
                            : // If selection is NOT NONE
                            selectedRepo() === repo
                            ? // If selection is SAME AS CURRENT
                              "N/A"
                            : // If selection is NOT SAME AS CURRENT
                              "Update repo"
                        : // If repo WAS NOT linked
                        selectedRepo() === "n/a"
                        ? // If selection is NONE
                          "N/A"
                        : // If selection is NOT NONE
                          "Clone and link repo"}
                </button>
            </Show>
            <Show when={repo != null && selectedRepo() === repo}>
                <button
                    class="btn btn-primary"
                    id="pull-repo"
                    onClick={() => {
                        if (loading()) return;
                        setLoading(true);

                        axios
                            .post(`/projects/${projectId}/repo/pull`)
                            .then((res) => {
                                setPullText("Pulled ✔");
                                setTimeout(() => {
                                    setPullText("Pull");
                                }, 3000);
                            })
                            .catch((err) => {
                                console.error(err);
                                alert("Something went wrong!\nErr: " + err.response.data.payload.message ?? err.message ?? "Unknown error");
                            })
                            .finally(() => setLoading(false));
                    }}
                >
                    {loading() ? "Loading..." : pullText()}
                </button>
            </Show>
        </div>
    );
};

export default RepoCard;
