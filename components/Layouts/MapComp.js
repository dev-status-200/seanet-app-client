import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWh0ZWFtaGFpbCIsImEiOiJjbDdvbGtucjEwNm91M3ZueGZwaTEwcDg4In0.Be48QvgVjJ5-MNt3pzEnfw'

function MapComp() {
  const mapContainer = useRef();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container:mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center:[
        -122.015807,
        45.655529
    ],
      zoom: 15
    })
    map.on('load', async () => {
		const response = await fetch('https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson');
		const data = await response.json();
		const coordinates = data.features[0].geometry.coordinates;

		data.features[0].geometry.coordinates = [coordinates[0]];

		map.addSource('trace', { type: 'geojson', data: data });
		map.addLayer({
			'id': 'trace',
			'type': 'line',
			'source': 'trace',
			'paint': {
				'line-color': 'yellow',
				'line-opacity': 0.75,
				'line-width': 5
			}
		});
		// setup the viewport
		let i = 0;
		const timer = setInterval(() => {
			if (i < coordinates.length) {
				data.features[0].geometry.coordinates.push(coordinates[i]);
				map.getSource('trace').setData(data);
				map.panTo(coordinates[i]);
				i++;
			} else {
				window.clearInterval(timer);
			}
		}, 10);
		}
	);
  })
  

  return (
    <div className='box'>
      <div ref={mapContainer} style={{width:'80vw', height:'70vh', borderRadius:5, border:'1px solid black'}}></div>
    </div>
  )
}
export default MapComp