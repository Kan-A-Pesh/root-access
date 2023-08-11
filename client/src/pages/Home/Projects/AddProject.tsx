import axios from "axios";
import { Component, createSignal, Show, Signal } from "solid-js";

const AddProject: Component = () => {
    const [loading, setLoading]: Signal<boolean> = createSignal<boolean>(false);
    const [payload, setPayload]: Signal<any> = createSignal<any>({
        name: "",
    });

    const createProject = () => {
        setLoading(true);

        axios
            .post("/projects/", payload())
            .then((res: any) => {
                if (res.data.status === "success") {
                    window.location.href = "/dash/projects/" + res.data.payload.id;
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Something went wrong!\nErr: " + err.response.data.payload.message ?? err.message ?? "Unknown error");
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <h1>Add a project</h1>
            <div class="container">
                <div class="card">
                    <h2 class="text-title">// PROJECT CODE-NAME</h2>
                    <input
                        type="text"
                        placeholder="root-access"
                        class="form-element"
                        value={payload().name}
                        onInput={(e: Event) => setPayload({ ...payload(), name: (e.target as HTMLInputElement).value })}
                    />
                    <Show when={payload().name.length < 3}>
                        <p class="error">Name must be at least 3 characters long</p>
                    </Show>
                </div>
                <div class="card">
                    <h2 class="text-title">// DETAILS (OPTIONAL)</h2>
                    <p class="text-handle">Display name</p>
                    <input
                        type="text"
                        placeholder="Root Access"
                        class="form-element"
                        value={payload().displayName || ""}
                        style={{ opacity: payload().displayName ? 1 : 0.5 }}
                        onInput={(e: Event) => {
                            const value = (e.target as HTMLInputElement).value;
                            if (value.length > 0) {
                                setPayload({ ...payload(), displayName: value });
                            } else {
                                const { displayName, ...rest } = payload();
                                setPayload(rest);
                            }
                        }}
                    />
                    <p class="text-handle">Description</p>
                    <input
                        type="text"
                        placeholder="A project to rule them all"
                        class="form-element"
                        value={payload().description || ""}
                        style={{ opacity: payload().description ? 1 : 0.5 }}
                        onInput={(e: Event) => {
                            const value = (e.target as HTMLInputElement).value;
                            if (value.length > 0) {
                                setPayload({ ...payload(), description: value });
                            } else {
                                const { description, ...rest } = payload();
                                setPayload(rest);
                            }
                        }}
                    />
                </div>

                <div class="card">
                    <h2 class="text-title">// DATES (OPTIONAL)</h2>

                    <p class="text-handle">Start date</p>
                    <input
                        type="date"
                        value={payload().startDate || ""}
                        class="form-element"
                        style={{ opacity: payload().startDate ? 1 : 0.5 }}
                        onInput={(e: Event) => {
                            const value = (e.target as HTMLInputElement).value;
                            if (value.length > 0) {
                                setPayload({ ...payload(), startDate: value });
                            } else {
                                const { startDate, ...rest } = payload();
                                setPayload(rest);
                            }
                        }}
                    />

                    <p class="text-handle">End date</p>
                    <input
                        type="date"
                        value={payload().endDate || ""}
                        class="form-element"
                        style={{ opacity: payload().endDate ? 1 : 0.5 }}
                        onInput={(e: Event) => {
                            const value = (e.target as HTMLInputElement).value;
                            if (value.length > 0) {
                                setPayload({ ...payload(), endDate: value });
                            } else {
                                const { endDate, ...rest } = payload();
                                setPayload(rest);
                            }
                        }}
                    />
                </div>

                <div class="card">
                    <h2 class="text-title">// CREATE PROJECT</h2>
                    <button
                        class="form-element btn btn-primary"
                        disabled={loading() || payload().name.length < 3}
                        onClick={() => createProject()}
                    >
                        Let's start!
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddProject;
