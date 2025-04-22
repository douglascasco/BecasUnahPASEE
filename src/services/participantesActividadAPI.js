import apiUrl from "../config";
import { handleTokenRefresh } from "./Auth/handleTokenRefresh";

export const fetchParticipantesActividadById = async ({ actividad_id }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/participantsActivity/${actividad_id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            return await handleTokenRefresh(fetchParticipantesActividadById, { actividad_id });
        }

        const data = await response.json();

        if (!response.ok) {
            return { state: false, body: data };
        }

        return { state: true, body: data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}

export const actualizarAsistencia = async ({ actividadId, noCuenta }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/updateattendanceactivity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ actividad_id: actividadId, no_cuenta: noCuenta }),
        });

        const data = await response.json();

        if (response.ok) {
            return { state: true, body: data.message };
        } else {
            console.error('Error al actualizar estado:', data);
            return { state: false, body: data.error };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error.message);
        return null;
    }
};