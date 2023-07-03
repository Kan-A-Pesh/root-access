import { useParams } from "@solidjs/router";
import axios from "axios";
import { Component, createSignal, For, Show } from "solid-js";
import fetchConnected from "~/utils/fetchConnected";
import ProxyCard from "./partials/ProxyCard";
import MemberCard from "./partials/MemberCard";
import RepoCard from "./partials/RepoCard";
import CredentialsCard from "./partials/CredentialsCard";

const Stats: Component = () => {
    const params = useParams();
    const [me, setMe] = createSignal<any>({});
    const [project, setProject] = createSignal<any>({});

    axios
        .get(`/projects/${params.id ?? "unknown"}`)
        .then((res: any) => {
            console.log(res.data.payload);
            setProject(res.data.payload);
        })
        .catch((err) => {
            console.error(err);
        });

    fetchConnected().then((meUser: any) => {
        setMe(meUser);
    });

    if (!project || !me)
        return (
            <div class="container">
                <div class="card">
                    <h2 class="text-title">// Loading ...</h2>
                </div>
            </div>
        );

    return (
        <>
            <h1>{project().displayName}</h1>
            <div class="container">
                <div class="card">
                    <h2 class="text-title">// PROJECT DETAILS</h2>
                    <p class="text-name">Name: {project().name}</p>
                    <p class="text-handle">Description: {project().description}</p>
                    <p class="text-role">Status: {project().status}</p>
                    <p class="text-role">
                        Due: {project().startDate ?? <span class="text-handle">N/A</span>} -{" "}
                        {project().endDate ?? <span class="text-handle">N/A</span>}
                    </p>
                </div>
                <div class="card">
                    <h2 class="text-title">// YOUR PERMISSIONS</h2>
                    <p class="text-role">Role: {project().role}</p>
                    <p class="text-role">
                        Edit metadata: {project().editMetadata ? <span class="success">Yes</span> : <span class="error">No</span>}
                    </p>
                </div>
                <Show when={project().permissions}>
                    <MemberCard canEdit={project().editPermissions} projectId={project().id} />
                </Show>
                <Show when={project().aliases}>
                    <ProxyCard projectAliases={project().aliases} editAliases={project().editAliases} projectId={project().id} />
                </Show>
                <Show when={project().githubRepo !== undefined}>
                    <RepoCard repo={project().githubRepo} editRepo={project().editGithubRepo} projectId={project().id} />
                </Show>
                <Show when={project().password || project().readPrivateKey}>
                    <CredentialsCard
                        projectId={project().id}
                        name={project().name}
                        password={project().password}
                        readKeys={project().readPrivateKey}
                    />
                </Show>
                <Show when={project().canDelete}>
                    <div class="card">
                        <h2 class="text-title">// DELETE PROJECT</h2>
                        <p class="text-handle">WARNING: This action is irreversible.</p>
                        <button
                            class="btn btn-danger"
                            onClick={() => {
                                if (
                                    prompt(`Are you sure you want to delete this project? Type \"${project().name}\" to confirm.`) ===
                                    project().name
                                ) {
                                    axios
                                        .delete(`/projects/${project().id}`)
                                        .then((res: any) => {
                                            window.location.href = "/dash/projects";
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                        });
                                }
                            }}
                        >
                            Delete Project
                        </button>
                    </div>
                </Show>
            </div>
        </>
    );
};

export default Stats;
