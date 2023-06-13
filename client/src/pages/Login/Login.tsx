import { Component, Show, Signal, createEffect, createSignal } from "solid-js";
import styles from "./Login.module.css";
import axios from "axios";

const Login: Component = () => {
    const [error, setError]: Signal<string> = createSignal<string>("");
    const [handle, setHandle]: Signal<string> = createSignal<string>("");
    const [password, setPassword]: Signal<string> = createSignal<string>("");
    const [loading, setLoading]: Signal<boolean> = createSignal<boolean>(false);

    // Clear error when handle or password changes
    createEffect(() => {
        setError("");
    }, [handle, password]);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);

        const credentials = {
            handle: handle(),
            password: password(),
        };

        // Clear password
        setPassword("");

        // Send credentials to server
        try {
            const res: any = await axios.post("/auth/login", credentials);

            // Save token to local storage
            localStorage.setItem("token", res.data.payload.token);

            // Redirect to dashboard page
            window.location.href = "/dash";
        } catch (err: any) {
            console.error(err);
            setError(err.response.data.payload.message ?? err.message ?? "Unknown error");
        }

        setLoading(false);
    };

    return (
        <div class={styles.form}>
            <div class="card">
                <h1 class={styles.title}>Login</h1>

                <div class={styles.form__group}>
                    <label for="handle" class="text-title">
                        Handle:
                    </label>
                    <input
                        type="text"
                        placeholder="handle"
                        class="form-element"
                        value={handle()}
                        onInput={(e: Event) => setHandle((e.target as HTMLInputElement).value)}
                    />
                </div>

                <div class={styles.form__group}>
                    <label for="password" class="text-title">
                        Password:
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        class="form-element"
                        value={password()}
                        onInput={(e: Event) => setPassword((e.target as HTMLInputElement).value)}
                    />
                </div>

                <Show when={error()}>
                    <div class={styles.form__group}>
                        <p classList={{ "text-role": true, [styles.error]: true }}>{error()}</p>
                    </div>
                </Show>

                <button class="form-element btn btn-primary" disabled={loading()} onClick={handleSubmit}>
                    {loading() ? "Loading..." : "Login"}
                </button>
            </div>
        </div>
    );
};

export default Login;
