import { Component, For, Show, createSignal } from "solid-js";
import styles from "./MemberModal.module.css";
import axios from "axios";

const MemberModal: Component<{
    title: string;
    exclude?: any;
    onDismiss: () => void;
    onSubmit: (user: any) => void;
}> = ({ title, exclude, onDismiss, onSubmit }) => {
    const [members, setMembers] = createSignal<any>(undefined);
    const [search, setSearch] = createSignal<string>("");

    axios
        .get(`/users/list`)
        .then((res: any) => {
            let payload = res.data.payload;
            if (exclude) {
                if (exclude.id)
                    payload = payload.filter((member: any) => {
                        return !exclude.id.includes(member.id);
                    });

                if (exclude.role)
                    payload = payload.filter((member: any) => {
                        return !exclude.role.includes(member.role);
                    });
            }
            setMembers(payload);
        })
        .catch((err) => {
            console.error(err);
        });

    return (
        <>
            <div class={styles.modal}>
                <div class={styles.card}>
                    <Show when={!members()}>
                        <h2 class="text-role">// Loading ...</h2>
                    </Show>
                    <Show when={members()}>
                        <h2 class="text-role">// {title}</h2>
                        <input
                            type="text"
                            class="form-element"
                            placeholder="Search ..."
                            onInput={(e) => setSearch(e.currentTarget.value)}
                            value={search()}
                        />
                        <div classList={{ [styles.scrollable]: true, ["scrollable"]: true }}>
                            <For
                                each={members().filter((member: any) => {
                                    return (
                                        member.realname.toLowerCase().includes(search().toLowerCase()) ||
                                        member.handle.toLowerCase().includes(search().toLowerCase())
                                    );
                                })}
                                fallback={<p class="text-handle">No results</p>}
                            >
                                {(member) => (
                                    <div class={styles.element}>
                                        <div>
                                            <p class="text-name">{member.realname}</p>
                                            <p class="text-handle">@{member.handle}</p>
                                        </div>
                                        <button
                                            class="btn btn-primary"
                                            onClick={() => {
                                                onSubmit(member);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </div>
            <div class={styles.backdrop} onClick={onDismiss}></div>
        </>
    );
};

export default MemberModal;
