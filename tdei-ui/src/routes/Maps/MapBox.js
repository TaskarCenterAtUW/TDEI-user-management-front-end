import React, {useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import style from "./Maps.module.css";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Box, Button } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';



mapboxgl.accessToken = 'pk.eyJ1IjoicmFqZXNoa2FudGlwdWRpMTIzNCIsImEiOiJjbGdqbWI3ODgwdnJ4M3BwZ2NvMmc1bnJ6In0.7pYEjYMQFucsipP71biCqg';

export default function MapBox({onGeoJsonAdded}) {
    const [zoom, setZoom] = useState(9);
    const [generatedPolygon, setGeneratedPolygon] = useState();

    const handleCopyToClipboard = () => {
        // @ts-ignore
        navigator.clipboard.writeText(JSON.stringify(generatedPolygon))
      };
    

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-122.17890206994159, 47.620582354986226],
            zoom: zoom
        });

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true,
                line_string: true,
                point: true
            },
        });
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            }),
            'top-right'
        );
        map.addControl(draw);
        map.addControl(new mapboxgl.NavigationControl());
        map.on('zoomend', () => {
            console.log('A zoomend event occurred.');
            setZoom(map.getZoom());
        });
        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);

        function updateArea(e) {
            const data = draw.getAll();
            const geojson = JSON.stringify(data);
            const jsonObject = JSON.parse(geojson);
            setGeneratedPolygon(jsonObject)
            document.getElementById('json').innerHTML = JSON.stringify(jsonObject, null, 2);
            onGeoJsonAdded(jsonObject);
        }
        return () => map.remove();
    }, [onGeoJsonAdded,zoom]);
    return (
        <div className={style.mapbox}>
            <div className="row">
                <div className="col-7">
                    <div id='map' className={style.mapContainer}/>
                </div>
                <div className="col-5">
                    <div className={style.jsonContent}>
                        <Box
                            sx={{
                                position: 'relative',
                                backgroundColor: '#f7f7f7',
                                padding: '20px',
                                minHeight: '200px',
                                height: 500,
                                overflow: "hidden",
                                overflowY: "scroll",
                                mb: 2,
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "0%",
                            }}
                        >
                            <Button
                                sx={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'transparent',
                                    border: '0.5px solid #f7b047',
                                    color: '#171D25',
                                    '&:hover': {
                                        background: 'transparent',
                                    },
                                }}
                            startIcon={<FileCopyIcon/>}
                            onClick={handleCopyToClipboard}
                            >
                                Copy
                            </Button>
                            <pre id='json' />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
}