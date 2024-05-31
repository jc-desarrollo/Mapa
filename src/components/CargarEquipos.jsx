import axios from 'axios';

export const cargarTodosLosEquipos = async () => {
    try {
        const response = await axios.get('https://transbetxi.com/WS/sacarEquipos.php', {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('No se pudo cargar la lista de equipos');
        }
    } catch (error) {
        throw error;
    }
};