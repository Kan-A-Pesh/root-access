import { Component, Show, Signal, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import axios from "axios";

import { parseRole } from "~/utils/role";
import fetchConnected from "~/utils/fetchConnected";

const Profile: Component = () => {
    const params = useParams();
    const [me, setMe]: Signal<any> = createSignal<any>({});
    const [user, setUser]: Signal<any> = createSignal<any>({});
    const [userRole, setUserRole]: Signal<string> = createSignal<string>("");

    axios
        .get(`/users/${params.handle ?? ""}`)
        .then((res: any) => {
            setUser(res.data.payload);
            setUserRole(res.data.payload.role);
        })
        .catch((err) => {
            console.error(err);
        });

    fetchConnected().then((meUser: any) => {
        setMe(meUser);
    });

    return (
        <>
            <h1>Profile</h1>
            <div class="container">
                <div class="card">
                    <h2 class="text-title">// Profile details</h2>
                    <p class="text-handle">@{user().handle ?? "Loading ..."}</p>
                    <p class="text-name">{user().realname ?? "Loading ..."}</p>
                    <p class="text-role">{parseRole(user().role)}</p>
                    <p class="text-handle">{user().email ?? "Loading ..."}</p>
                </div>
                <div class="card">
                    <h2 class="text-title">// Contributions</h2>
                    <p class="text-name">Project count: N/A</p>
                </div>

                <Show when={me().role === "admin"}>
                    <div class="card">
                        <h2 class="text-title">// Edit role</h2>
                        <select
                            class="form-element select"
                            value={userRole()}
                            onInput={(e: Event) => setUserRole((e.target as HTMLInputElement).value)}
                        >
                            <option value="admin">Administrator</option>
                            <option value="respo">Manager</option>
                            <option value="member">Member</option>
                        </select>
                        <button
                            class="form-element btn btn-primary"
                            onClick={() => {
                                if (user()._id === me()._id) {
                                    if (
                                        !confirm(
                                            "⚠️ Are you sure you want to change your own role?\n" +
                                                "\n" +
                                                "This can't be undone and you'll have to contact an other administrator to change it back.\n" +
                                                "Press OK to continue or Cancel to abort.",
                                        )
                                    ) {
                                        return;
                                    }
                                }

                                if (user().role === userRole()) {
                                    return;
                                }

                                if (user().role === "admin") {
                                    if (!confirm("⚠️ Are you sure you want to change the role of an administrator?")) {
                                        return;
                                    }
                                }

                                axios
                                    .patch(`/users/${user().handle}`, { role: userRole() })
                                    .then((res: any) => {
                                        const userObject = { ...user() };
                                        userObject.role = res.data.payload.to;

                                        setUser(userObject);
                                        setUserRole(res.data.payload.to);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                    });
                            }}
                        >
                            Edit role
                        </button>
                    </div>

                    <div class="card">
                        <h2 class="text-title">// Delete account</h2>
                        <button class="form-element btn btn-danger">Delete</button>
                    </div>
                </Show>
            </div>
        </>
    );
};

export default Profile;
