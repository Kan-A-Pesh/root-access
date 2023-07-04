import { Component } from "solid-js";
import { A } from "@solidjs/router";

import styles from "./Navbar.module.css";

import { Icon } from "solid-heroicons";
import { users, archiveBox, cog_6Tooth, arrowRightOnRectangle } from "solid-heroicons/outline";

const Navbar: Component = () => {
    return (
        <nav class={styles.navbar}>
            <A href="/dash">
                <div classList={{ [styles.link]: true, [styles.profile]: true }}>
                    <p class={styles.profile__name}>AZ</p>
                </div>
            </A>
            <A href="/dash/members">
                <div class={styles.link}>
                    <Icon path={users} />
                </div>
            </A>
            <A href="/dash/projects">
                <div class={styles.link}>
                    <Icon path={archiveBox} />
                </div>
            </A>
            <A href="/dash/settings">
                <div class={styles.link}>
                    <Icon path={cog_6Tooth} />
                </div>
            </A>
            <A href="/logout">
                <div class={styles.link}>
                    <Icon path={arrowRightOnRectangle} />
                </div>
            </A>
        </nav>
    );
};

export default Navbar;
