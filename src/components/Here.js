import React, { useState, useEffect } from 'react';

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
        });

        let destinationMarker = null
        let line = null
        let label = null

        // Add tap listeners:
        map.addEventListener('tap', function (evt) {

            const coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
            console.log(coord.lat, coord.lng)

            //remove last destination
            if (destinationMarker) { map.removeObject(destinationMarker) }

            //remove last line
            if (line) { map.removeObject(line) }

            //remove last distance label
            if (label) { map.removeObject(label) }

            //find nearest marker
            findNearestMarker(coord)

            //add a destination marker
            const svgMarkup = '<svg width="24" height="24" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M26 4v12h-16v12h-4v-24h20z"></path>' +
                '</svg>';

            const icon = new H.map.Icon(svgMarkup)
            destinationMarker = new H.map.Marker(coord, { icon: icon });

            map.addObject(destinationMarker);
        })

        const findNearestMarker = (coords) => {
            var minDist = 10000000000000,
                nearest_text = '*None*',
                markerDist,
                // get all objects added to the map
                objects = map.getObjects(),
                len = map.getObjects().length,
                i;
            if (len === 0) { return }

            // iterate over objects and calculate distance between them
            for (i = 0; i < len; i += 1) {
                markerDist = objects[i].getGeometry().distance(coords);
                if (markerDist < minDist) {
                    minDist = markerDist;
                    nearest_text = objects[i].getData();
                }
            }

            console.log('The nearest marker is: ' + nearest_text + 'distance: ' + minDist.toFixed(0));

            //draw a line between destination and nearest origin
            const lineString = new H.geo.LineString();

            const nearest_origin_coord = objects[nearest_text - 1].b
            const destination_coord = coords
            const label_coord = {
                lat: (nearest_origin_coord.lat + destination_coord.lat) / 2,
                lng: (nearest_origin_coord.lng + destination_coord.lng) / 2
            }

            //coords of the nearest origin marker
            lineString.pushPoint(nearest_origin_coord);
            //coords of the destination marker
            lineString.pushPoint(destination_coord);

            line = new H.map.Polyline(lineString, { style: { lineWidth: 2 } })
            map.addObject(line)

            //add distance label
            const svgMarkup = '<svg width="100" height="24" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<text x="50" y="18" font-size="10pt" font-family="Arial" font-weight="bold" ' +
                'text-anchor="middle" fill="black">${distance} m</text>' +
                '</svg>';

            const icon = new H.map.Icon(svgMarkup.replace('${distance}', minDist.toFixed(0)))
            label = new H.map.Marker(label_coord, { icon: icon })

            map.addObject(label)
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

            <form style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 2 }}>
                <input id='page1' name='page' type='radio' onClick={() => window.location.href = '/tab1'}></input>
                <label for="page1" style={{ fontSize: '13px' }}> page 1</label><br></br>
                <input id='page2' name='page' type='radio' onClick={() => window.location.href = '/tab2'}></input>
                <label for="page2" style={{ fontSize: '13px' }}> page 2</label><br></br>
                <input id='page3' name='page' type='radio' onClick={() => window.location.href = '/tab3'}></input>
                <label for="page3" style={{ fontSize: '13px' }}> page 3</label>
            </form>
        </div>
    );

}