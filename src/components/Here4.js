import React, { useState, useEffect } from 'react';
import { Plugins } from '@capacitor/core';
import PageForm from './PageForm'

export default function Here4() {
    const [map, setMap] = useState(null)
    const [layer, setLayer] = useState(null)

    const { Geolocation } = Plugins;

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
                center: { lat: 48.30432303555956, lng: -104.94466241321628 },
                pixelRatio: window.devicePixelRatio || 1
            }
        );

        // Enable the event system on the map instance:
        const mapEvents = new H.mapevents.MapEvents(map);

        // Instantiate the default behavior, providing the mapEvents object:
        const behavior = new H.mapevents.Behavior(mapEvents);

        function renderKML() {
            // Create a reader object passing in the URL of our KML file
            const reader = new H.data.kml.Reader('areas.kml');
            reader.addEventListener("statechange", function (evt) {
                if (evt.state === H.data.AbstractReader.State.READY) {
                    // Get KML layer from the reader object and add it to the map
                    map.addLayer(reader.getLayer());
                    reader.getLayer().getProvider().addEventListener("tap", (evt) => {
                        alert(evt.target.getData().name)
                    });
                }
                if (evt.state === H.data.AbstractReader.State.ERROR) {
                    alert('KML parsing error')
                }
            });

            // Parse the document
            reader.parse();
        }

        renderKML()

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

            <span id='headingDom' style={{
                position: 'fixed', top: '40px', left: '10px',
                zIndex: 2, fontSize: '13px'
            }}></span>

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

        </div>
    );

}