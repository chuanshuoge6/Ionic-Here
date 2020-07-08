import React, { useState, useEffect } from 'react';
import PageForm from './PageForm'
import axios from 'axios';

export default function Here6() {
    const [map, setMap] = useState(null)
    const [layer, setLayer] = useState(null)
    const [optimizeWayPoint, setOptimizeWayPoint] = useState(true)

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

        let markerNum = 1

        // Add longpress listeners:
        map.addEventListener('longpress', function (evt) {

            const coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);

            //add a marker with number on left
            const svgMarkup = '<svg width="24" height="24" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M16.5 24.447v-0.996c3.352 0.099 5.993 1.174 5.993 2.487 0 1.379-2.906 2.56-6.492 2.56s-6.492-1.181-6.492-2.56c0-1.313 2.641-2.389 5.992-2.487v0.996c-2.799 0.069-4.993 0.71-4.993 1.491 0 0.827 2.459 1.623 5.493 1.623 3.033 0 5.492-0.796 5.492-1.623-0.001-0.781-2.194-1.421-4.993-1.491zM10.516 8.995c0-3.033 2.521-5.493 5.556-5.493 3.034 0 5.493 2.46 5.493 5.493 0 2.607-1.818 4.786-4.256 5.348l-1.309 13.219-1.313-13.256c-2.362-0.615-4.171-2.756-4.171-5.311zM16 7.524c0-0.828-0.671-1.498-1.498-1.498s-1.499 0.67-1.499 1.498c0 0.827 0.671 1.498 1.499 1.498s1.498-0.67 1.498-1.498z"></path>' +
                '<text x="6" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
                'text-anchor="middle" fill="black">${markerText}</text>' +
                '</svg>';

            const icon = new H.map.Icon(svgMarkup.replace('${markerText}', markerNum))
            const marker = new H.map.Marker(coord, { icon: icon })

            // add custom data to the marker
            marker.setData(markerNum);
            markerNum++

            map.addObject(marker);
        });

        let destinationMarker = null
        let routeLine = null

        // Add tap listeners:
        map.addEventListener('tap', function (evt) {

            const coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);

            //remove last destination
            if (destinationMarker) { map.removeObject(destinationMarker) }

            //remove last route line
            if (routeLine) { map.removeObject(routeLine) }

            //find nearest marker
            calculateRouteFromAtoB(coord)

            //add a destination marker
            const svgMarkup = '<svg width="24" height="24" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M26 4v12h-16v12h-4v-24h20z"></path>' +
                '</svg>';

            const icon = new H.map.Icon(svgMarkup)
            destinationMarker = new H.map.Marker(coord, { icon: icon });

            map.addObject(destinationMarker);
        })

        function calculateRouteFromAtoB(coords) {
            //get start and way points
            const objects = map.getObjects()
            if (objects.length === 0) { return }

            var router = platform.getRoutingService(),
                routeRequestParams = {
                    mode: 'fastest;car',
                    representation: 'display',
                    routeattributes: 'waypoints,summary,shape,legs',
                    maneuverattributes: 'direction,action',
                    //waypoint0: start.lat + ',' + start.lng, // start
                    //waypoint1: stop1.lat + ',' + stop1.lng, // stop1 
                    //waypoint2: coords.lat + ',' + coords.lng  // destination
                };

            if (document.getElementById('optimizeWayPointCheckBox').checked) {
                //reorder waypoint order first, then route
                let webString = 'https://wse.ls.hereapi.com/2/findsequence.json?start=start;'
                    + objects[0].b.lat + ',' + objects[0].b.lng + '&'
                let j = 1
                for (; j < objects.length; j++) {
                    const wayPoint = objects[j].b
                    webString = webString + 'destination' + j.toString() + '=stop' + j.toString() + ';' + wayPoint.lat + ',' + wayPoint.lng + '&'
                }

                webString = webString + 'end=' + 'destination' + ';' + coords.lat + ',' + coords.lng + '&'
                    + 'mode=fastest;car&'
                    + 'apiKey=' + 'JNIn_O9OQdca51JT5ofoou0WOKdp69bNG-XxHaHqPLo'

                //console.log(webString)
                axios.get(webString)
                    .then(function (response) {
                        // handle success
                        const orderedWayPoint = response.data.results[0].waypoints
                        //console.log(orderedWayPoint);
                        for (let i = 0; i < orderedWayPoint.length; i++) {
                            routeRequestParams['waypoint' + i.toString()] = orderedWayPoint[i].lat + ',' + orderedWayPoint[i].lng
                        }

                        router.calculateRoute(
                            routeRequestParams,
                            onSuccess,
                            onError
                        );
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
            }
            else {
                //route waypoint in sequence without optimization
                //start and stop on the way
                let i = 0
                for (; i < objects.length; i++) {
                    const wayPoint = objects[i].b
                    routeRequestParams['waypoint' + i.toString()] = wayPoint.lat + ',' + wayPoint.lng
                }

                //destination
                routeRequestParams['waypoint' + i.toString()] = coords.lat + ',' + coords.lng

                //console.log(routeRequestParams)

                router.calculateRoute(
                    routeRequestParams,
                    onSuccess,
                    onError
                );
            }
        }

        function onSuccess(result) {
            var route = result.response.route[0];
            console.log(route)

            //add route to map
            var lineString = new H.geo.LineString(),
                routeShape = route.shape

            routeShape.forEach(function (point) {
                var parts = point.split(',');
                lineString.pushLatLngAlt(parts[0], parts[1]);
            });

            routeLine = new H.map.Polyline(lineString, {
                style: {
                    lineWidth: 3,
                    strokeColor: 'rgba(0, 128, 255, 0.7)'
                }
            });
            // Add the polyline to the map
            map.addObject(routeLine);
            // And zoom to its bounding rectangle
            map.getViewModel().setLookAtData({
                bounds: routeLine.getBoundingBox()
            });
        }

        function onError(error) {
            alert('Can\'t reach the remote server');
        }

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

            <form style={{
                position: 'fixed', top: '40px', left: '10px', zIndex: 2,
                backgroundColor: 'white', fontSize: '13px', color: 'red'
            }}>
                <input type="checkbox" id="optimizeWayPointCheckBox" name="checkbox1"></input>
                <label for="checkbox1"><i> optimize route</i></label>
            </form>

            <button style={{
                position: 'fixed', top: '10px', left: '50%', zIndex: 2,
                transform: 'translateX(-50%)', backgroundColor: '#F8C471',
                height: '50px', width: '50px', borderRadius: '25px',
                fontSize: '20px',
            }}
                onClick={() => alert('long press to add start and way points\ntap to add destination\ncheck optimize route to find fastest route')}
            >Tip</button>
        </div>
    );

}