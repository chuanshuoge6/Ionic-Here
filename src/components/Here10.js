import React, { useState, useEffect } from 'react';
import PageForm from './PageForm'
import axios from 'axios'

export default function Here() {
    const [map, setMap] = useState(null)
    const [layer, setLayer] = useState(null)

    useEffect(() => {
        getMap()
        setTimeout(() => {
            document.getElementById('refreshButton').click()
        }, 1000);
        return () => map.dispose();
    }, []);

    const H = window.H;

    const platform = new H.service.Platform({
        apikey: "JNIn_O9OQdca51JT5ofoou0WOKdp69bNG-XxHaHqPLo"
    });

    const defaultLayers = platform.createDefaultLayers();

    const getMap = () => {
        // Create an instance of the map
        const map = new H.Map(
            document.getElementById('mapView'),
            layer ? layer : defaultLayers.raster.normal.map,
            {
                // This map is centered over Europe
                zoom: 3,
                center: { lat: 51.048615, lng: -114.070847 },
                pixelRatio: window.devicePixelRatio || 1
            }
        );

        // Enable the event system on the map instance:
        const mapEvents = new H.mapevents.MapEvents(map);

        let destinationMarker = null

        // Add tap listeners:
        map.addEventListener('tap', function (evt) {

            const coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
            console.log(coord.lat, coord.lng)

            //find local time
            const bingUrl = 'https://dev.virtualearth.net/REST/v1/Elevation/List?points=' +
                coord.lat.toString() + ',' + coord.lng.toString() +
                '&key=AhNPHFdo4aSWZx-zbVfAoRT5V1j8B2OMjvE511qMlEnAzvKNxVy3Yux1f8cd5YPs'

            axios.get(bingUrl)
                .then(function (response) {
                    // handle success
                    const data = response.data.resourceSets[0].resources[0].elevations;
                    console.log(data)
                    document.getElementById('elevation').innerHTML = data[0]

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })

            //remove last destination
            if (destinationMarker) { map.removeObject(destinationMarker) }

            //add a destination marker
            const svgMarkup = '<svg width="24" height="24" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M26 4v12h-16v12h-4v-24h20z"></path>' +
                '</svg>';

            const icon = new H.map.Icon(svgMarkup)
            destinationMarker = new H.map.Marker(coord, { icon: icon });

            map.addObject(destinationMarker);
        })



        // Instantiate the default behavior, providing the mapEvents object:
        const behavior = new H.mapevents.Behavior(mapEvents);

        setMap(map)
    }

    const layerChange = async (selected) => {
        switch (selected) {
            case '1':
                await setLayer(defaultLayers.raster.normal.map)
                break
            case '2':
                await setLayer(defaultLayers.raster.normal.transit)
                break
            case '3':
                await setLayer(defaultLayers.raster.normal.mapnight)
                break
            case '4':
                await setLayer(defaultLayers.raster.normal.trafficincidents)
                break
            case '5':
                await setLayer(defaultLayers.raster.normal.xbase)
                break
            case '6':
                await setLayer(defaultLayers.raster.satellite.map)
                break
            case '7':
                await setLayer(defaultLayers.raster.satellite.xbase)
                break
            case '8':
                await setLayer(defaultLayers.raster.terrain.map)
                break
            case '9':
                await setLayer(defaultLayers.raster.terrain.xbase)
                break
            default:
                break
        }

        document.getElementById('refreshButton').click()
    }

    return (
        // Set a height on the map so it will display
        <div id='mapView' style={{ height: '100%' }}>
            <button id='refreshButton' onClick={() => { map.dispose(); getMap() }}
                style={{
                    position: 'fixed', top: '10px', left: '10px', zIndex: 2,
                    border: '2px solid green'
                }}
            >refresh</button>

            <select style={{
                position: 'fixed', top: '10px', left: '80px',
                height: '18px', width: '90px', zIndex: 2, fontSize: '13px'
            }}
                onChange={e => layerChange(e.target.value)}
            >
                <option value="1">default layer</option>
                <option value="2">transit</option>
                <option value="3">night</option>
                <option value="4">accident</option>
                <option value="5">xbase</option>
                <option value="6">satellite</option>
                <option value="7">satellite xbase</option>
                <option value="8">terrain</option>
                <option value="9">terrain xbase</option>
            </select>

            <button style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 2 }}
                onClick={() => {
                    const formStyle = document.getElementById('pageForm').style
                    if (formStyle.display === 'none') {
                        formStyle.position = 'fixed'
                        formStyle.top = '30px'
                        formStyle.right = '10px'
                        formStyle.zIndex = 2
                        formStyle.display = 'block'
                        formStyle.backgroundColor = 'white'
                    }
                    else {
                        formStyle.display = 'none'
                    }
                }}>
                <i class="fa fa-bars"></i></button>

            <PageForm />

            <div style={{ position: 'fixed', top: '40px', left: '10px', zIndex: 2, backgroundColor: 'white' }}>
                Elevation: <i style={{ color: 'red' }} id='elevation'></i> m<br />
            </div>

            <button style={{
                position: 'fixed', top: '10px', left: '50%', zIndex: 2,
                transform: 'translateX(-50%)', backgroundColor: '#F8C471',
                height: '50px', width: '50px', borderRadius: '25px',
                fontSize: '20px',
            }}
                onClick={() => alert('Tap to get elevation')}
            >Tip</button>
        </div>
    );

}