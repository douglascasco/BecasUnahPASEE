import apiUrl from "../../config";

const fetchData = async () => {
    try {
        const response = await fetch(`${apiUrl}/api/faq?`, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "https://becas-unah-pasee-6s04om6n9-douglas-cascos-projects.vercel.app",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const dataFetch = await response.json();

        return dataFetch;
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }

}
export default fetchData;