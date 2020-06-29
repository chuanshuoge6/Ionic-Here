import React, { useState, useEffect } from 'react';
import { Plugins } from '@capacitor/core';
import PageForm from './PageForm'

export default function Here2() {
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
                zoom: 10,
                center: { lat: 51.048615, lng: -114.070847 },
                pixelRatio: window.devicePixelRatio || 1
            }
        );

        // Enable the event system on the map instance:
        const mapEvents = new H.mapevents.MapEvents(map);

        // Instantiate the default behavior, providing the mapEvents object:
        const behavior = new H.mapevents.Behavior(mapEvents);

        function rotateDomMarker() {
            if (!map) { return }

            var domIconElement = document.createElement('div'),
                interval;

            // set the anchor using margin css property depending on the content's (svg element below) size
            // to make sure that the icon's center represents the marker's geo positon
            domIconElement.style.margin = '-20px 0 0 -20px';

            // add content to the element
            domIconElement.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40">
                <path d="m0.812665,23.806608l37.937001,-22.931615l-21.749812,38.749665l1.374988,-17.749847l-17.562177,1.931797z"
                  fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#fff"/>
              </svg>`;

            // create dom marker and add it to the map
            var marker = map.addObject(new H.map.DomMarker({ lat: 51.11277809892326, lng: -114.10858273008175 }, {
                icon: new H.map.DomIcon(domIconElement, {
                    onAttach: function (clonedElement, domIcon, domMarker) {
                        var clonedContent = clonedElement.getElementsByTagName('svg')[0];

                        // set last used value for rotation when dom icon is attached (back in map's viewport)
                        clonedContent.style.transform = 'rotate(' + (-45) + 'deg)';

                        let watchN = 0, gps = null
                        // set interval to rotate icon's content by 45 degrees every second.
                        interval = setInterval(async () => {

                            Geolocation.clearWatch({ id: watchN })
                            gps = null

                            const wait = Geolocation.watchPosition({}, (position, err) => {

                                watchN = wait.toString()
                                gps = position.coords
                                console.log(gps)

                                const heading = gps.heading ? parseInt(gps.heading) - 45 : -45
                                document.getElementById('headingDom').innerHTML = 'Heading: ' + heading.toString()

                                clonedContent.style.transform = 'rotate(' + (heading) + 'deg)';
                            })

                        }, 1000)
                    },
                    onDetach: function (clonedElement, domIcon, domMarker) {
                        // stop the rotation if dom icon is not in map's viewport
                        clearInterval(interval);
                    }
                })
            }));
        }

        rotateDomMarker()

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