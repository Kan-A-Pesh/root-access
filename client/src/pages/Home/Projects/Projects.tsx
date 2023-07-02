import { A } from "@solidjs/router";
import axios from "axios";
import { Component, createSignal, Signal, For, Show } from "solid-js";
import fetchConnected from "~/utils/fetchConnected";

const Projects: Component = () => {
    const [me, setMe]: Signal<any> = createSignal<any>({});
    const [projects, setProjects]: Signal<any> = createSignal<any>([]);

    axios.get(`/projects`).then((res) => {
        setProjects(res.data.payload);
    });

    fetchConnected().then((meUser: any) => {
        setMe(meUser);
    });

    return (
        <>
            <h1>Projects</h1>
            <div class="container">
                <For each={projects()}>
                    {(project) => (
                        <div class="card">
                            <h2 class="text-title">// {project.name}</h2>
                            <p class="text-name">{project.displayName}</p>
                            <p class="text-handle">{project.description}</p>
                            <br />
                            <p class="text-role">Status: {project.status}</p>
                            <p class="text-role">
                                Due: {project.startDate ?? <span class="text-handle">N/A</span>} -{" "}
                                {project.endDate ?? <span class="text-handle">N/A</span>}
                            </p>
                            <br />
                            <Show when={project.canAccess}>
                                <A href={"/dash/projects/" + project.id} class="form-element btn btn-primary">
                                    View project
                                </A>
                            </Show>
                            <Show when={!project.canAccess}>
                                <p class="form-element btn btn-disabled">No access</p>
                            </Show>
                        </div>
                    )}
                </For>
                <Show when={!projects().length}>
                    <div class="card">
                        <h2 class="text-title">// Oops...</h2>
                        <p class="text-handle">No projects found</p>
                    </div>
                </Show>
                <Show when={me().role === "admin" || me().role === "respo"}>
                    <div class="card">
                        <h2 class="text-title">// Create a project</h2>
                        <A href="/dash/projects/add" class="form-element btn btn-primary">
                            Create project
                        </A>
                    </div>
                </Show>
            </div>
        </>
    );
};

export default Projects;
