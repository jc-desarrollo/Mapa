import axios from 'axios';

const baseUrl = 'https://transbetxi.com/WS/sacarUbicacion.php';

export const cargarUbicaciones = async (equiposSeleccionados) => {
    try {
        const params = new URLSearchParams({ equipos: equiposSeleccionados.join(',') });
        const response = await axios.get(`${baseUrl}?${params.toString()}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate', // Evita la caché
                'Pragma': 'no-cache', // Para compatibilidad con HTTP/1.0
                'Expires': '0', // Expira inmediatamente
                'code': 'pass23sd2aASED6',
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('No se pudo cargar las ubicaciones');
        }
    } catch (error) {
        throw error;
    }
};

