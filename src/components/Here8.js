import React, { useState, useEffect } from 'react';
import PageForm from './PageForm'

export default function Here() {
    const [map, setMap] = useState(null)
    const [layer, setLayer] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(10)
    const [mapCenter, setMapCenter] = useState({ lat: 51.048615, lng: -114.070847 })

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
                zoom: zoomLevel,
                center: mapCenter,
                pixelRatio: window.devicePixelRatio || 1
            }
        );

        // Enable the event system on the map instance:
        const mapEvents = new H.mapevents.MapEvents(map);

        let markerNum = 1
        let createdPolygon = null

        // Add longpress listeners:
        map.addEventListener('longpress', function (evt) {
            //remove last polygon
            if (createdPolygon) { map.removeObject(createdPolygon) }

            const coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
            console.log(coord.lat, coord.lng)

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

            var objects = map.getObjects()
            const area = computeArea(objects)
            document.getElementById('area').innerHTML = area

            //draw polygon
            drawPolygon()
        });

        // Add double tap listeners:
        map.addEventListener('dbltap', function (evt) {
            //remove last polygon
            if (createdPolygon) { map.removeObject(createdPolygon) }

            //dboule tap delete last marker
            var objects = map.getObjects(),
                len = map.getObjects().length;
            if (len === 0) { return }

            map.removeObject(objects[len - 1])
            objects.pop()
            markerNum--

            const area = computeArea(objects)
            document.getElementById('area').innerHTML = area

            drawPolygon()
        })

        const drawPolygon = () => {
            // get all objects added to the map
            var objects = map.getObjects(),
                len = map.getObjects().length,
                i;
            if (len < 3) { createdPolygon = null; return }

            const vertexes = []
            // iterate over objects and calculate distance between them
            for (i = 0; i < len; i++) {
                vertexes.push(objects[i].b.lat)
                vertexes.push(objects[i].b.lng)
                vertexes.push(100)
            }

            vertexes.push(objects[0].b.lat)
            vertexes.push(objects[0].b.lng)
            vertexes.push(100)

            const lineString = new H.geo.LineString(
                vertexes,
                'values lat lng alt'
            );

            createdPolygon = map.addObject(
                new H.map.Polygon(lineString, {
                    style: {
                        fillColor: 'rgba(255, 238, 0, 0.7)',
                        strokeColor: 'rgba(55, 85, 170, 0.6)',
                        lineWidth: 2
                    }
                })
            );
        }

        function computeArea(latLngs) {
            var pointsCount = latLngs.length,
                area = 0.0,
                d2r = Math.PI / 180.0,
                radius = 6378137.0,
                p1, p2;

            if (pointsCount <= 2)
                return 0;

            for (var i = 0; i < pointsCount; i++) {
                p1 = latLngs[i].b;
                p2 = latLngs[(i + 1) % pointsCount].b;
                area += (p2.lng - p1.lng) * d2r *
                    (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * radius * radius / 2.0;
            return Math.abs(area / 1000000).toFixed(3);
        }

        // Instantiate the default behavior, providing the mapEvents object:
        const behavior = new H.mapevents.Behavior(mapEvents);

        // responsible for disabling the double tap (click) to zoom
        behavior.disable(H.mapevents.Behavior.DBLTAPZOOM);

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
                Area is <i style={{ color: 'red' }} id='area'></i> km<sup>2</sup>
            </div>

            <button style={{ position: 'fixed', bottom: '50px', right: '10px', zIndex: 2, border: '2px solid green' }}
                onClick={async () => {
                    await setZoomLevel(map.getZoom() + 1)
                    await setMapCenter(map.getCenter())
                    document.getElementById('refreshButton').click()
                }}>
                <i class="fa fa-plus"></i>
            </button>

            <button style={{ position: 'fixed', bottom: '20px', right: '10px', zIndex: 2, border: '2px solid green' }}
                onClick={async () => {
                    await setZoomLevel(map.getZoom() - 1)
                    await setMapCenter(map.getCenter())
                    document.getElementById('refreshButton').click()
                }}>
                <i class="fa fa-minus"></i>
            </button>

            <button style={{
                position: 'fixed', top: '10px', left: '50%', zIndex: 2,
                transform: 'translateX(-50%)', backgroundColor: '#F8C471',
                height: '50px', width: '50px', borderRadius: '25px',
                fontSize: '20px',
            }}
                onClick={() => alert('long press to add vertex\n\double tap to remove vertex\n\marea is calculate if there are 3 or more vertex')}
            >Tip</button>
        </div>
    );

}