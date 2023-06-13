import { Component, For, Show, Signal, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import axios from "axios";

import { parseRole } from "~/utils/role";
import fetchConnected from "~/utils/fetchConnected";

const Members: Component = () => {
    const [users, setUsers]: Signal<any> = createSignal<any>({});
    const [me, setMe]: Signal<any> = createSignal<any>({});

    axios
        .get(`/users/list`)
        .then((res: any) => {
            setUsers(res.data.payload);
        })
        .catch((err) => {
            console.error(err);
        });

    fetchConnected().then((meUser: any) => {
        setMe(meUser);
    });

    return (
        <>
            <h1>Members</h1>
            <div class="container">
                <For each={users()}>
                    {(user: any) => (
                        <div class="card">
                            <p class="text-handle">@{user.handle}</p>
                            <p class="text-name">{user.realname}</p>
                            <p class="text-role">{parseRole(user.role)}</p>
                            <p class="text-handle">{user.email}</p>
                            <A href={"/dash/members/" + user.handle} class="form-element btn btn-primary">
                                View profile
                            </A>
                        </div>
                    )}
                </For>
                <Show when={me().role === "admin"}>
                    <div class="card">
                        <h2 class="text-title">// Add a member</h2>
                        <A href="/dash/members/add" class="form-element btn btn-primary">
                            Add member
                        </A>
                    </div>
                </Show>
            </div>
        </>
    );
};

export default Members;
