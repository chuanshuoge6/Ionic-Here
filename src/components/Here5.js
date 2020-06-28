import React, { useState, useEffect } from 'react';
import { Plugins } from '@capacitor/core';

export default function Here5() {
    const [map, setMap] = useState(null)
    const [layer, setLayer] = useState(null)
    const [houseNumber, setHouseNumber] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')

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

        function geocode() {
            var geocoder = platform.getGeocodingService()

            if (country === '') { return }

            var geocodingParameters = {
                housenumber: houseNumber,
                street: street,
                city: city,
                country: country,
                jsonattributes: 1
            };

            geocoder.geocode(
                geocodingParameters,
                onSuccess,
                onError
            );
        }

        function onSuccess(result) {
            var locations = result.response.view[0].result;
            var center = null

            for (let i = 0; i < locations.length; i++) {

                const svgMarkup = '<svg width="24" height="24" ' +
                    'xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M16.5 24.447v-0.996c3.352 0.099 5.993 1.174 5.993 2.487 0 1.379-2.906 2.56-6.492 2.56s-6.492-1.181-6.492-2.56c0-1.313 2.641-2.389 5.992-2.487v0.996c-2.799 0.069-4.993 0.71-4.993 1.491 0 0.827 2.459 1.623 5.493 1.623 3.033 0 5.492-0.796 5.492-1.623-0.001-0.781-2.194-1.421-4.993-1.491zM10.516 8.995c0-3.033 2.521-5.493 5.556-5.493 3.034 0 5.493 2.46 5.493 5.493 0 2.607-1.818 4.786-4.256 5.348l-1.309 13.219-1.313-13.256c-2.362-0.615-4.171-2.756-4.171-5.311zM16 7.524c0-0.828-0.671-1.498-1.498-1.498s-1.499 0.67-1.499 1.498c0 0.827 0.671 1.498 1.499 1.498s1.498-0.67 1.498-1.498z"></path>' +
                    '<text x="6" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
                    'text-anchor="middle" fill="black">${markerText}</text>' +
                    '</svg>';

                const icon = new H.map.Icon(svgMarkup.replace('${markerText}', i + 1))
                const position = locations[i].location.displayPosition
                console.log(position)

                const coord = { lat: position.latitude, lng: position.longitude }
                if (i === 0) { center = coord }

                const marker = new H.map.Marker(coord, { icon: icon })
                map.addObject(marker);
            }

            //zoom into 1st location found
            //create boundary
            var CircleBoundary = new H.map.Circle(
                new H.geo.Point(center.lat, center.lng), //center
                11703, // Radius 
                { style: { fillColor: 'rgba(0, 0, 0, 0)' } }
            );

            map.getViewModel().setLookAtData({
                zoom: 15,
                bounds: CircleBoundary.getBoundingBox()
            });
        }

        function onError(error) {
            alert('Can\'t reach the remote server');
        }

        geocode()

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

            <form id='pageForm' style={{ display: 'none' }}>
                <input id='page1' name='page' type='radio' onClick={() => window.location.href = '/tab1'}></input>
                <label for="page1" style={{ fontSize: '13px' }}> measure</label><br></br>
                <input id='page2' name='page' type='radio' onClick={() => window.location.href = '/tab2'}></input>
                <label for="page2" style={{ fontSize: '13px' }}> domMarker</label><br></br>
                <input id='page3' name='page' type='radio' onClick={() => window.location.href = '/tab3'}></input>
                <label for="page3" style={{ fontSize: '13px' }}> cluster</label><br />
                <input id='page4' name='page' type='radio' onClick={() => window.location.href = '/tab4'}></input>
                <label for="page4" style={{ fontSize: '13px' }}> kml</label><br />
                <input id='page5' name='page' type='radio' onClick={() => window.location.href = '/tab5'}></input>
                <label for="page5" style={{ fontSize: '13px' }}> search</label><br />
            </form>

            <button onClick={() => {
                const searchFormStyle = document.getElementById('searchForm').style
                if (searchFormStyle.display === 'none') {
                    searchFormStyle.display = 'block'
                    searchFormStyle.position = 'fixed'
                    searchFormStyle.top = '60px'
                    searchFormStyle.left = '10px'
                    searchFormStyle.zIndex = 2
                }
                else {
                    searchFormStyle.display = 'none'
                }
            }}
                style={{
                    position: 'fixed', top: '40px', left: '10px', zIndex: 2,
                    border: '2px solid green'
                }}
            >search address</button>

            <form id='searchForm' style={{ display: 'none' }} onSubmit={e => e.preventDefault()}>
                <input id='houseNumber' placeholder='house #' style={{ width: '150px' }}
                    onChange={e => { setHouseNumber(e.target.value); }}>
                </input><br />
                <input id='street' placeholder='street' style={{ width: '150px' }}
                    onChange={e => setStreet(e.target.value)}>
                </input><br />
                <input id='city' placeholder='city' style={{ width: '150px' }}
                    onChange={e => setCity(e.target.value)}>
                </input><br />
                <input id='country' placeholder='country' style={{ width: '150px' }}
                    onChange={e => setCountry(e.target.value)}></input><br />
                <button style={{ border: '2px solid green' }}
                    onClick={() => {
                        document.getElementById('refreshButton').click();
                        setTimeout(() => {
                            document.getElementById('refreshButton').click();
                        }, 1000);
                    }}>
                    submit</button>
            </form>

        </div>
    );

}