import axios from "axios";
import { Component, createSignal, For, Show } from "solid-js";

const ProxyCard: Component<{
    projectAliases: [
        {
            id: string;
            destination: string;
            remoteUrls: string[];
        },
    ];
    editAliases: boolean;
    projectId: string;
}> = ({ projectAliases, editAliases, projectId }) => {
    const [aliases, setAliases] = createSignal<any>(projectAliases);

    return (
        <div class="card">
            <h2 class="text-title">// PROXY ALIASES</h2>
            <div class="scrollable">
                <For each={aliases()} fallback={<p class="text-handle">No aliases</p>}>
                    {(alias) => (
                        <div class="card">
                            <p class="text-role">{alias.destination}</p>
                            <For each={alias.remoteUrls}>{(url) => <p class="text-handle">{url}</p>}</For>
                            <button
                                class="form-element btn btn-danger"
                                onClick={() => {
                                    axios.delete(`/projects/${projectId}/aliases/${alias.id}`).then((res) => {
                                        setAliases(aliases().filter((a: any) => a.id !== alias.id));
                                    });
                                }}
                            >
                                Delete alias
                            </button>
                        </div>
                    )}
                </For>
            </div>
            <Show when={editAliases}>
                <button
                    class="form-element btn btn-primary"
                    onClick={() => {
                        const destination = prompt("Enter destination");
                        const alias = (prompt("Enter remote URLs (separated by commas)") ?? "").split(",");
                        axios.post(`/projects/${projectId}/aliases`, { destination, alias }).then((res) => {
                            setAliases([
                                ...aliases(),
                                {
                                    id: res.data.payload.id,
                                    destination: res.data.payload.destination,
                                    remoteUrls: res.data.payload.remoteUrls,
                                },
                            ]);
                        });
                    }}
                >
                    Add alias (BETA)
                </button>
            </Show>
        </div>
    );
};

export default ProxyCard;
