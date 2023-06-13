import { Component } from "solid-js";
import { A } from "@solidjs/router";

import styles from "./Navbar.module.css";

import users from "~/assets/img/icons/users.svg";
import archive from "~/assets/img/icons/archive.svg";
import logout from "~/assets/img/icons/log-out.svg";

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
                    <img src={users} alt="Members" />
                </div>
            </A>
            <A href="/dash/projects">
                <div class={styles.link}>
                    <img src={archive} alt="Projects" />
                </div>
            </A>
            <A href="/logout">
                <div class={styles.link}>
                    <img src={logout} alt="Logout" />
                </div>
            </A>
        </nav>
    );
};

export default Navbar;
