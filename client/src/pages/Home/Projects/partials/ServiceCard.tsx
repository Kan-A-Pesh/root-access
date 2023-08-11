import axios from "axios";
import { Component, Show, createEffect, createSignal } from "solid-js";

const ServiceCard: Component<{
    projectId: string;
    editService: boolean;
}> = ({ projectId, editService }) => {
    const [service, setService] = createSignal<any>(undefined);
    const [error, setError] = createSignal<any>(undefined);
    const [loading, setLoading] = createSignal<boolean>(true);

    // Fetch service when loading state is true
    createEffect(() => {
        if (loading()) {
            axios
                .get(`/projects/${projectId}/service`)
                .then((res: any) => {
                    setService(res.data.payload);
                })
                .catch((err) => {
                    setError(err.response.data.payload.message);
                    setService(null);
                });
        }
    }, [loading]);

    if (service() === null) {
        return (
            <div class="card">
                <h2 class="text-title">// SERVICE</h2>
                <p class="text-role">No service found</p>
                <p class="text-handle">
                    Create a service by adding a <code>root.config</code> file to your root/repo directory
                </p>
            </div>
        );
    }

    return (
        <div class="card">
            <h2 class="text-title">// SERVICE</h2>
            <Show when={service() === undefined}>
                <p class="text-role">Loading ...</p>
            </Show>
            <Show when={service() === null}>
                <p class="text-role">No service found</p>
                <p class="text-handle">{error()}</p>
            </Show>
            <Show when={service()}>
                <p class="text-role">
                    Status:{" "}
                    {service() ? (
                        service().status ? (
                            <span class="success">Online</span>
                        ) : (
                            <span class="error">Offline</span>
                        )
                    ) : (
                        <span class="text-handle">Loading ...</span>
                    )}
                </p>
                <Show when={editService}>
                    <button
                        class="form-element btn btn-primary"
                        onClick={() => {
                            axios
                                .post(`/projects/${projectId}/service/start`)
                                .then((res: any) => {
                                    setLoading(true);
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        }}
                    >
                        Start service
                    </button>
                    <button
                        class="form-element btn btn-primary"
                        onClick={() => {
                            axios
                                .post(`/projects/${projectId}/service/stop`)
                                .then((res: any) => {
                                    setLoading(true);
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        }}
                    >
                        Stop service
                    </button>
                </Show>
                <div class="scrollable">
                    <Show when={service()} fallback={<pre>Fetching logs ...</pre>}>
                        <pre>{service().logs}</pre>
                    </Show>
                </div>
            </Show>
        </div>
    );
};

export default ServiceCard;
