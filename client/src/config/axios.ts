import axios from "axios";

axios.defaults.transformRequest = [
    (data, headers) => {
        headers["Content-Type"] = "application/json";

        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return JSON.stringify(data);
    },
];
