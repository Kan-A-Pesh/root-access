import axios from "axios";
import { Component, For, Show, createSignal } from "solid-js";
import MemberModal from "~/components/MemberModal/MemberModal";

const MemberCard: Component<{
    canEdit: boolean;
    projectId: string;
}> = ({ canEdit, projectId }) => {
    const [members, setMembers] = createSignal<any>([]);
    const [modal, setModal] = createSignal<boolean>(false);

    axios
        .get(`/projects/${projectId}/members`)
        .then((res: any) => {
            setMembers(res.data.payload);
        })
        .catch((err) => {
            console.error(err);
        });

    return (
        <>
            <Show when={modal()}>
                <MemberModal
                    title="Add member"
                    onDismiss={() => {
                        setModal(false);
                    }}
                    exclude={{
                        id: members().map((m: any) => m.userId),
                        role: ["admin", "respo"],
                    }}
                    onSubmit={(user) => {
                        axios
                            .post(`/projects/${projectId}/members`, { handle: user.handle, role: "dev" })
                            .then((res: any) => {
                                setMembers([
                                    ...members(),
                                    {
                                        userId: res.data.payload.id,
                                        role: res.data.payload.role,
                                        user: {
                                            handle: user.handle,
                                            realname: user.realname,
                                            role: user.role,
                                        },
                                    },
                                ]);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                        setModal(false);
                    }}
                />
            </Show>
            <div class="card">
                <h2 class="text-title">// PROJECT MEMBERS</h2>
                <div class="scrollable">
                    <For each={members()} fallback={<p class="text-handle">No members</p>}>
                        {(member) => (
                            <div class="card">
                                <p>
                                    {member.user.realname} <span class="text-handle">@{member.user.handle}</span>
                                </p>
                                <p class="text-role">Role: {member.role}</p>
                                <Show when={canEdit}>
                                    <button
                                        class="btn btn-danger"
                                        onClick={() => {
                                            axios
                                                .delete(`/projects/${projectId}/members/${member.user.handle}`)
                                                .then(() => {
                                                    setMembers(members().filter((m: any) => m.userId !== member.userId));
                                                })
                                                .catch((err) => {
                                                    console.error(err);
                                                });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </Show>
                            </div>
                        )}
                    </For>
                </div>
                <Show when={canEdit}>
                    <button
                        class="btn btn-primary"
                        onClick={() => {
                            setModal(true);
                        }}
                    >
                        Add member
                    </button>
                </Show>
            </div>
        </>
    );
};

export default MemberCard;
