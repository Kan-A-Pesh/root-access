import { Component, createSignal } from "solid-js";
import styles from "./Background.module.css";

import gradient from "~/assets/img/background/gradient.png";

const Background: Component = () => {
    return (
        <div class={styles.background}>
            <img src={gradient} alt="gradient" />
        </div>
    );
};

export default Background;
