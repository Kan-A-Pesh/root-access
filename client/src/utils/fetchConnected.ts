import axios from "axios";

export default async function fetchConnected() {
    try {
        const res: any = await axios.get(`/users`);
        return res.data.payload;
    } catch (err) {
        console.error(err);
    }
}
