import React, { useRef, useEffect, useState } from 'react';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { cargarUbicaciones } from '../components/SacarUbicacion'; // Asegúrate de importar correctamente
import { cargarTodosLosEquipos } from '../components/CargarEquipos';

const carIconUrl = 'https://github.com/carloshg12/ProjectAssets/blob/main/TransBetxi/marker.png?raw=true';

export const Mapa = () => {
    const googleMapRef = useRef(null);
    const googleMap = useRef(null);
    const markersRef = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);

    const coordinates = [
        { lat: 39.9249792, lng: -0.1976609 },
        { lat: 39.9264883, lng: -0.1989767 },
        { lat: 39.9264883, lng: -0.2189767 }
    ];

    useEffect(() => {
        const loadGoogleMap = () => {
            if (window.google && !googleMap.current) {
                googleMap.current = new window.google.maps.Map(googleMapRef.current, {
                    center: { lat: 39.9215200, lng: -0.1959200 },
                    zoom: 16,
                });
                setMapLoaded(true);
            }
        };

        window.initMap = loadGoogleMap;

        if (!mapLoaded && !document.querySelector('script[src^="https://maps.googleapis.com"]')) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2mCQsTLIh0dpT5PB9U7mSCvlAHzjwDlk&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        // Cargar todos los equipos solo una vez al montar el componente
        cargarTodosLosEquipos().then(data => {
            setEquipos(data);
        }).catch(err => {
            console.error('Error al cargar todos los equipos:', err);
        });

        return () => {
            if (mapLoaded) {
                window.initMap = undefined; // Limpieza al desmontar
            }
        };
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapLoaded) return;

        const updateMarkersAndDrawLine = () => {
            // Limpiar marcadores anteriores
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // Añadir marcador de ubicación del usuario
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                const userLocationMarker = new window.google.maps.Marker({
                    position: userLocation,
                    map: googleMap.current,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeWeight: 2
                    },
                    title: "Tu ubicación"
                });
                markersRef.current.push(userLocationMarker);
            }, () => {
                console.log('Error al obtener la ubicación');
            });

            // Dibujar línea entre las coordenadas especificadas
            const linePath = new window.google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            linePath.setMap(googleMap.current);

            // Cargar ubicaciones de los equipos seleccionados y añadir marcadores
            if (equiposSeleccionados.length > 0) {
                cargarUbicaciones(equiposSeleccionados).then(data => {
                    data.forEach(loc => {
                        const marker = new window.google.maps.Marker({
                            position: { lat: parseFloat(loc.latitud), lng: parseFloat(loc.longitud) },
                            map: googleMap.current,
                            icon: {
                                url: carIconUrl,
                                scaledSize: new window.google.maps.Size(75, 75)
                            },
                            title: loc.nombreEquipo || "Sin descripción"
                        });
                        markersRef.current.push(marker);
                    });
                });
            }
        };

        const intervalId = setInterval(updateMarkersAndDrawLine, 5000);
        updateMarkersAndDrawLine(); // Iniciar la primera actualización inmediatamente

        return () => {
            clearInterval(intervalId);
            markersRef.current.forEach(marker => marker.setMap(null));
        };
    }, [mapLoaded, equiposSeleccionados]);


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setEquiposSeleccionados(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            <div ref={googleMapRef} style={{ flexGrow: 1, height: '100%' }} />
            <FormControl sx={{ width: 300, margin: 3 }}>
                <InputLabel id="equipos-select-label">Equipos</InputLabel>
                <Select
                    labelId="equipos-select-label"
                    id="equipos-select"
                    multiple
                    value={equiposSeleccionados}
                    onChange={handleChange}
                    input={<OutlinedInput label="Equipos" />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {equipos.map((equipo) => (
                        <MenuItem key={equipo.id} value={equipo.nombreEquipo}>
                            <Checkbox checked={equiposSeleccionados.indexOf(equipo.nombreEquipo) > -1} />
                            <ListItemText primary={equipo.nombreEquipo} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default Mapa;
