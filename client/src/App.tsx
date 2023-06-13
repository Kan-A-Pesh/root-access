import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import Home from "~/pages/Home/Home";
import Login from "~/pages/Login/Login";
import NotFound from "~/pages/NotFound/NotFound";
import Logout from "~/pages/Logout/Logout";

import Members from "~/pages/Home/Members/Members";
import AddMember from "~/pages/Home/AddMember/AddMember";
import Projects from "~/pages/Home/Projects/Projects";
import Profile from "~/pages/Home/Profile/Profile";

import Background from "~/components/Background/Background";

import "./root.css";

const App: Component = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dash" component={Home}>
                    <Route path="/" component={Profile} />
                    <Route path="/members" component={Members} />
                    <Route path="/members/add" component={AddMember} />
                    <Route path="/members/:handle" component={Profile} />
                    <Route path="/projects" component={Projects} />
                </Route>
                <Route path="/logout" component={Logout} />
                <Route path="/login" component={Login} />
                <Route path="*" component={NotFound} />
            </Routes>
            <Background />
        </Router>
    );
};

export default App;
