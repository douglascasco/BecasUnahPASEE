import apiUrl from "../../config";

export const fetchBecaById = async ({ beca_id }) => {
    try {
        const response = await fetch(`${apiUrl}/api/becas/${beca_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.status) {
            return { state: false, body: data.beca };
        }

        return { state: true, body: data.beca }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}

export const fetchStateBecaById = async ({ estado_beca_id }) => {
    try {
        const response = await fetch(`${apiUrl}/api/beca_estado/${estado_beca_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        const data = await response.text();

        if (!response.ok) {
            return { state: false, body: data };
        }

        return { state: true, body: data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}