import { Component } from "solid-js";
import { Outlet } from "@solidjs/router";

import Navbar from "~/components/Navbar/Navbar";

import "./Home.css";

const Home: Component = () => {
    // Check if the user is logged in
    if (!localStorage.getItem("token")) {
        window.location.href = "/login";
    }

    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Home;
