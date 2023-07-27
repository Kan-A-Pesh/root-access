import { lazy, type Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

const Home = lazy(() => import("~/pages/Home/Home"));
import Login from "~/pages/Login/Login";
import Logout from "~/pages/Logout/Logout";

const Members = lazy(() => import("~/pages/Home/Members/Members"));
const AddMember = lazy(() => import("~/pages/Home/Members/AddMember"));
const Profile = lazy(() => import("~/pages/Home/Members/Profile"));
const Projects = lazy(() => import("~/pages/Home/Projects/Projects"));
const AddProject = lazy(() => import("~/pages/Home/Projects/AddProject"));
const Stats = lazy(() => import("~/pages/Home/Projects/Stats"));
const Register = lazy(() => import("~/pages/Register/Register"));
const Settings = lazy(() => import("~/pages/Home/Settings/Settings"));

import Background from "~/components/Background/Background";

import "./root.css";

const App: Component = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dash" component={Home}>
                    <Route path="/members" component={Members} />
                    <Route path="/members/add" component={AddMember} />
                    <Route path="/members/:handle" component={Profile} />
                    <Route path="/projects" component={Projects} />
                    <Route path="/projects/add" component={AddProject} />
                    <Route path="/projects/:id" component={Stats} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/*" component={Profile} />
                </Route>
                <Route path="/logout" component={Logout} />
                <Route path="/register" component={Register} />
                <Route path="/*" component={Login} />
            </Routes>
            <Background />
        </Router>
    );
};

export default App;
