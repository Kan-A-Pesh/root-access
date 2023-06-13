import { Component, Signal, createSignal } from "solid-js";
import styles from "./AddMember.module.css";
import axios from "axios";

const AddMember: Component = () => {
    const [userRealname, setUserRealname]: Signal<string> = createSignal<string>("");
    const [userRole, setUserRole]: Signal<string> = createSignal<string>("member");
    const [userEmail, setUserEmail]: Signal<string> = createSignal<string>("");
    const [loading, setLoading]: Signal<boolean> = createSignal<boolean>(false);

    return (
        <>
            <h1>Add a member</h1>

            <div class="container">
                <div class="card">
                    <h2 class="text-title">// Real name</h2>
                    <input
                        type="text"
                        placeholder="Real name"
                        class="form-element"
                        value={userRealname()}
                        onInput={(e: Event) => setUserRealname((e.target as HTMLInputElement).value)}
                    />
                </div>

                <div class="card">
                    <h2 class="text-title">// Email</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        class="form-element"
                        value={userEmail()}
                        onInput={(e: Event) => setUserEmail((e.target as HTMLInputElement).value)}
                    />
                </div>

                <div class="card">
                    <h2 class="text-title">// Role</h2>
                    <select
                        class="form-element select"
                        value={userRole()}
                        onInput={(e: Event) => setUserRole((e.target as HTMLInputElement).value)}
                    >
                        <option value="admin">Administrator</option>
                        <option value="respo">Manager</option>
                        <option value="member">Member</option>
                    </select>
                </div>

                <div class="card">
                    <h2 class="text-title">// Send invitation</h2>
                    <button
                        class="form-element btn btn-primary"
                        onClick={() => {
                            setLoading(true);

                            axios
                                .post("/auth/register", {
                                    realname: userRealname(),
                                    email: userEmail(),
                                    role: userRole(),
                                })
                                .then((res: any) => {
                                    if (res.data.status === "success") {
                                        alert("Invitation sent!");
                                        setUserEmail("");
                                        setUserRealname("");
                                        setUserRole("member");
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);
                                    alert("Something went wrong!\nErr: " + err.data.payload.message ?? err.message ?? "Unknown error");
                                });

                            setLoading(false);
                        }}
                        disabled={loading()}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddMember;
