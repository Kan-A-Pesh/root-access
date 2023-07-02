import axios from "axios";
import { Component, Show, createSignal } from "solid-js";

const CredentialsCard: Component<{
    projectId: string;
    name: string;
    password: string;
    readKeys: boolean;
}> = ({ projectId, name, password, readKeys }) => {
    const [keys, setKeys] = createSignal<any>(undefined);

    if (readKeys)
        axios
            .get(`/projects/${projectId}/keys`)
            .then((res: any) => {
                setKeys(res.data.payload);
            })
            .catch((err) => {
                console.error(err);
            });

    return (
        <div class="card">
            <h2 class="text-title">// CREDENTIALS</h2>
            <p>Use these credentials to connect to FTP, SSH, etc.</p>

            <div class="card">
                <p class="text-role">USERNAME</p>
                <input type="text" class="form-element" value={name} readonly />
            </div>

            <div class="card">
                <p class="text-role">PASSWORD</p>
                <input type="text" class="form-element" value={password} readonly />
            </div>

            <Show when={readKeys}>
                <div class="card">
                    <p class="text-role">KEYS</p>
                    <Show when={keys()}>
                        <a href={"data:text/plain," + keys().private} download={name + ".key"} class="btn btn-primary">
                            Download private key
                        </a>
                        <a href={"data:text/plain," + keys().public} download={name + ".key.pub"} class="btn btn-primary">
                            Download public key
                        </a>
                    </Show>
                    <Show when={!keys()}>
                        <p class="text-handle">Downloading keys ...</p>
                    </Show>
                </div>
            </Show>
        </div>
    );
};

export default CredentialsCard;
