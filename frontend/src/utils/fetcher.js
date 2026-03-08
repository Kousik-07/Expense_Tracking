import http from "./http";

const fetcher = async (url) => {
    try {
        const { data } = await http.get(url);
        return data;
    } catch (error) {
        throw error;
    }
}
export default fetcher