import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import style from "./Maps.module.css";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Box, Button } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';



mapboxgl.accessToken = `${process.env.REACT_APP_MAP_KEY}`

export default function MapBox({ isEdit, geojson, onGeoJsonAdded }) {
    const [zoom, setZoom] = useState(9);
    const [generatedPolygon, setGeneratedPolygon] = useState();

    const handleCopyToClipboard = () => {
        // @ts-ignore
        if (generatedPolygon !== undefined) {
            navigator.clipboard.writeText(JSON.stringify(generatedPolygon))
        } else {
            navigator.clipboard.writeText(JSON.stringify(geojson))
        }
    };

    const handleGeoJsonSelected = (jsonContent) => {
        onGeoJsonAdded(jsonContent);
    }

    function areAllCoordinatesZero(geojsonData) {        
        const coordinates = geojsonData.features[0].geometry.coordinates[0];
        return coordinates.every(coordArray =>
            coordArray.every(element => element === 0)
          );
      }    

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
                line_string: false,
                point: false
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

        // Get the average of coordinates
        const coordinates = geojson?.features[0].geometry.coordinates
        console.log(coordinates[0])
        const longitudes = coordinates[0].map((coords) => coords[0])
        console.log(longitudes)
        const latitudes = coordinates[0].map((coords) => coords[1])
        const minLat = Math.min(...latitudes)
        const maxLat = Math.max(...latitudes)
        const minLon = Math.min(...longitudes)
        const maxLon = Math.max(...longitudes)
        const centerLat = (minLat + maxLat) / 2.0
        const centerLon = (minLon + maxLon) / 2.0
        console.log(centerLat)
        console.log(centerLon)
        console.log(minLat)

        if (isEdit && !areAllCoordinatesZero(geojson)) {
            draw.add(geojson.features[0]);
            const bounds = new mapboxgl.LngLatBounds(
                new mapboxgl.LngLat(minLon, minLat),
                new mapboxgl.LngLat(maxLon, maxLat)
            );
            map.fitBounds(bounds,{maxZoom: 16});
        }

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);
        map.on('draw.add', updateArea);

        function updateArea(e) {
            const data = draw.getAll();
            const geojson = JSON.stringify(data);
            const jsonObject = JSON.parse(geojson);
            setGeneratedPolygon(jsonObject)
            document.getElementById('json').innerHTML = JSON.stringify(jsonObject, null, 2);
            handleGeoJsonSelected(jsonObject);
        }
        document.getElementById('json').innerHTML = JSON.stringify(geojson, null, 2);
        return () => map.remove();
    }, [ isEdit]);
    return (
        <div className={style.mapbox}>
            <div className="row">
                <div className="col-7">
                    <div className='mapbox'>
                        <div className='mapbox-container'>
                            <div id='map' className={style.mapContainer} />
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <div className={style.jsonContent}>
                        <Box
                            sx={{
                                position: 'relative',
                                padding: '20px',
                                minHeight: '200px',
                                height: '90vh',
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
                                startIcon={<FileCopyIcon />}
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