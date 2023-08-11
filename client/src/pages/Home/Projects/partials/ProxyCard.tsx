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
                            <p class="text-role">→ {alias.destination}</p>
                            <For each={alias.remoteUrls}>
                                {(url) => (
                                    <>
                                        <Show when={editAliases}>
                                            <input
                                                type="text"
                                                value={url}
                                                class="form-element"
                                                onChange={(e) => {
                                                    const newAliases = aliases().map((newAlias: any) => {
                                                        if (newAlias.id === alias.id) {
                                                            newAlias.remoteUrls = newAlias.remoteUrls.map((newUrl: any) => {
                                                                if (newUrl === url) {
                                                                    return e.target.value;
                                                                }
                                                                return newUrl;
                                                            });
                                                        }
                                                        return newAlias;
                                                    });
                                                    setAliases(newAliases);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === " " || e.key === "Enter" || e.key === "Tab" || e.key === ",") {
                                                        e.preventDefault();

                                                        const newAliases = aliases().map((newAlias: any) => {
                                                            if (newAlias.id === alias.id) {
                                                                newAlias.remoteUrls.push("");
                                                            }
                                                            return newAlias;
                                                        });
                                                        setAliases(newAliases);
                                                    }
                                                }}
                                            />
                                        </Show>
                                        <Show when={!editAliases}>
                                            <p class="text-handle">{url}</p>
                                        </Show>
                                    </>
                                )}
                            </For>
                        </div>
                    )}
                </For>
            </div>
            <Show when={editAliases && aliases() !== projectAliases}>
                <button
                    class="button button--primary"
                    onClick={() => {
                        axios
                            .put(`/projects/${projectId}/aliases`, { aliases: aliases() })
                            .then((res) => {
                                window.location.reload();
                            })
                            .catch((err) => {
                                console.error(err);
                                alert("Something went wrong!\nErr: " + err.response.data.payload.message ?? err.message ?? "Unknown error");
                            });
                    }}
                >
                    Save
                </button>
            </Show>
        </div>
    );
};

export default ProxyCard;
