import React, { useState, useEffect } from 'react';
import { Plugins } from '@capacitor/core';
import '../pages/Tab3.css';
import PageForm from './PageForm'

export default function Here3() {
    const [map, setMap] = useState(null)
    const [layer, setLayer] = useState(null)
    const [data, setData] = useState([])

    const { Geolocation } = Plugins;

    useEffect(() => {
        getMap()
        generateMarkers()
        setTimeout(() => {
            document.getElementById('refreshButton').click()
        }, 1000);

        return () => map.dispose();
    }, []);

    const generateMarkers = () => {
        const xMin = 50.84561389596551
        const xMax = 51.21708943492305
        const xDiff = xMax - xMin
        const yMax = -113.80644441313935
        const yMin = -114.36916364528605
        const yDiff = yMax - yMin
        const randomPositions = []

        for (let i = 0; i < 1000; i++) {
            const position = {
                lat: Math.random() * xDiff + xMin,
                lng: Math.random() * yDiff + yMin
            }
            randomPositions.push(position)
        }

        setData(randomPositions)
    }

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

        // create the default UI component, for displaying bubbles
        var ui = H.ui.UI.createDefault(map, defaultLayers);

        function startClustering(map, data) {
            // First we need to create an array of DataPoint objects,
            // for the ClusterProvider
            var dataPoints = data.map(function (item, index) {
                //datapoint ={lat, lng, attitude, data}, id is stored in point.data, 
                //image URL can be stored in data as well
                return new H.clustering.DataPoint(item.lat, item.lng, null, index);
            });

            // Create a clustering provider with custom options for clusterizing the input
            var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
                clusteringOptions: {
                    // Maximum radius of the neighbourhood
                    eps: 32,
                    // minimum weight of points required to form a cluster
                    minWeight: 2
                }
            });

            function reverseGeocode(location) {
                var geocoder = platform.getGeocodingService(),
                    reverseGeocodingParameters = {
                        prox: location.lat.toString() + ',' + location.lng.toString(),
                        mode: 'retrieveAddresses',
                        maxresults: '1',
                        jsonattributes: 1
                    };

                geocoder.reverseGeocode(
                    reverseGeocodingParameters,
                    reverseGeocodeSuccess,
                    reverseGeocodeError
                );
            }

            function reverseGeocodeSuccess(result) {
                const address = result.response.view[0].result;
                console.log(address)

                document.getElementById('bubbleDomTextArea').innerHTML = address[0].location.address.label
            }

            function reverseGeocodeError(error) {
                console.log(error)
            }

            // Note that we attach the event listener to the cluster provider, and not to
            // the individual markers
            clusteredDataProvider.addEventListener('tap', e => {
                // Get position of the "clicked" marker
                const position = e.target.getGeometry();

                const viewportX = (e.currentPointer.viewportX - 70).toString() + 'px'
                const viewportY = (e.currentPointer.viewportY - 160).toString() + 'px'

                const bubbleId = e.target.data.a.data;

                const bubbleDom = document.getElementById('bubbleDom')
                bubbleDom.style.position = 'fixed'
                bubbleDom.style.top = viewportY
                bubbleDom.style.left = viewportX
                bubbleDom.style.display = 'block'
                bubbleDom.style.zIndex = 2
                bubbleDom.style.backgroundColor = 'white'
                bubbleDom.style.fontSize = '13px'
                bubbleDom.style.width = '150px'

                reverseGeocode(position)

                document.getElementById('bubbleDomText').innerHTML =
                    'ID: ' + bubbleId + '<br/>'
                //   + 'Lat: ' + position.lat.toString() + '<br/>Lng' + position.lng.toString()
            }
            );


            // Create a layer tha will consume objects from our clustering provider
            var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);

            // To make objects from clustering provder visible,
            // we need to add our layer to the map
            map.addLayer(clusteringLayer);
        }

        if (data.length > 0) {
            startClustering(map, data);
        }

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

            <div id='bubbleDom' style={{ display: 'none' }}>
                <span style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => document.getElementById('bubbleDom').style.display = 'none'}>
                    X</span>

                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQleYrlNGWPV7IqQspqT71rj9Ht-gFTGRku4q7anMgFqymF-qDI&usqp=CAU"
                    style={{ marginLeft: '20px' }}
                    alt="house for sale" width="100" height="100"></img><br />

                <span id='bubbleDomText'></span>
                <textarea id='bubbleDomTextArea' rows='2' cols='20' wrap="hard"
                    style={{ resize: 'none', borderWidth: 0 }}></textarea>
            </div>
        </div>
    );

}