import { Component } from "solid-js";

const Logout: Component = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";

    return <></>;
};

export default Logout;
