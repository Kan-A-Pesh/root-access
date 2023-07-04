import axios from "axios";
import { Component, For, Show, Signal, createSignal } from "solid-js";
import fetchConnected from "~/utils/fetchConnected";

const Settings: Component = () => {
    const [settings, setSettings] = createSignal<{ [key: string]: string }>({});

    const fetchSettings = () => {
        axios.get(`/settings`).then((res) => {
            setSettings(res.data.payload);
        });
    };

    fetchConnected().then((meUser: any) => {
        if (meUser.role === "admin") {
            fetchSettings();
        }
    });

    return (
        <>
            <h1>Settings</h1>
            <div class="container">
                <div class="card">
                    <h2 class="text-title">// USER-SCOPE</h2>
                    <p class="text-handle">Coming soon...</p>
                </div>
                <Show when={Object.keys(settings()).length}>
                    <div class="card">
                        <h2 class="text-title">// PROJECT-SCOPE</h2>
                        <For each={Object.keys(settings())}>
                            {(setting) => (
                                <>
                                    <label for={setting} class="text-handle">
                                        {setting}
                                    </label>
                                    <input
                                        type="text"
                                        class="form-element"
                                        id={setting}
                                        name={setting}
                                        value={settings()[setting]}
                                        onChange={(e) => {
                                            const newSettings = settings();
                                            newSettings[setting] = e.target.value;
                                            setSettings(newSettings);
                                        }}
                                    />
                                    <br />
                                </>
                            )}
                        </For>
                        <button
                            class="form-element btn btn-primary"
                            onClick={() => {
                                axios
                                    .post(`/settings`, settings())
                                    .then(() => {
                                        alert("Settings saved!");
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        fetchSettings();
                                    });
                            }}
                        >
                            Save settings
                        </button>
                    </div>
                </Show>
            </div>
        </>
    );
};

export default Settings;
