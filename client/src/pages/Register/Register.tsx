import { Component, Show, Signal, createEffect, createSignal } from "solid-js";
import styles from "./Register.module.css";
import axios from "axios";
import { useSearchParams } from "@solidjs/router";

const Register: Component = () => {
    const [error, setError]: Signal<string> = createSignal<string>("");
    const [handle, setHandle]: Signal<string> = createSignal<string>("");
    const [password, setPassword]: Signal<string> = createSignal<string>("");
    const [loading, setLoading]: Signal<boolean> = createSignal<boolean>(false);
    const [confirmPassword, setConfirmPassword]: Signal<string> = createSignal<string>("");
    const [params, setParams] = useSearchParams();

    // Clear error when handle or password changes
    createEffect(() => {
        setError("");
    }, [handle, password, confirmPassword]);

    // Redirect to dashboard if already logged in
    if (localStorage.getItem("token")) window.location.href = "/dash";

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        setLoading(true);

        if (password() !== confirmPassword()) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const credentials = {
            token: params["token"],
            handle: handle(),
            password: password(),
        };

        // Clear password
        setPassword("");
        setConfirmPassword("");

        // Send credentials to server
        axios
            .post("/auth/register/finish", credentials)
            .then((res) => {
                window.location.href = "/login";
            })
            .catch((err) => {
                console.error(err);
                setError(err.response.data.payload.message ?? err.message ?? "Unknown error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div class={styles.form}>
            <div class="card">
                <h1 class={styles.title}>ACTIVATE</h1>

                <div class={styles.form__group}>
                    <label for="realname" class="text-title">
                        Name:
                    </label>
                    <input type="text" class="form-element" value={params["realname"]} readOnly={true} />
                </div>

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

                <div class={styles.form__group}>
                    <label for="confirmPassword" class="text-title">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        placeholder="confirm password"
                        class="form-element"
                        value={confirmPassword()}
                        onInput={(e: Event) => setConfirmPassword((e.target as HTMLInputElement).value)}
                    />
                </div>

                <Show when={error()}>
                    <div class={styles.form__group}>
                        <p classList={{ "text-role": true, error: true }}>{error()}</p>
                    </div>
                </Show>

                <button class="form-element btn btn-primary" disabled={loading()} onClick={handleSubmit}>
                    {loading() ? "Loading..." : "Activate my account"}
                </button>
            </div>
        </div>
    );
};

export default Register;
