import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import io from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_SEANET_SYS_URL);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWh0ZWFtaGFpbCIsImEiOiJjbDdvbGtucjEwNm91M3ZueGZwaTEwcDg4In0.Be48QvgVjJ5-MNt3pzEnfw';

function MapComp() {
  const mapContainer = useRef();
  let map;

  const [mapData, setMapData] = useState({
		type: "FeatureCollection",
		features: [{
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: [[67.06765895742515,24.877320553480782]]
				}
			}]
	})

	useEffect(() => {
		map = new mapboxgl.Map({
			container:mapContainer.current,
			style: 'mapbox://styles/mapbox/dark-v10',
			center:[67.06765895742515, 24.877320553480782],
			zoom: 15
		})
		map.on('load', async () => {
			map.addSource('trace', { type: 'geojson', data: mapData })
			map.addLayer({
				'id': 'trace',
				'type': 'line',
				'source': 'trace',
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': '#03AA46',
					'line-width': 4,
					'line-opacity': 0.8
				}
			})
		})
	}, [])

  	useEffect(() => {
		let coords = [];
		socket.on("receive_message", async(data) => {
			coords = [ parseFloat(data.long), parseFloat(data.lat) ]
			let prevCoords = mapData.features[0].geometry.coordinates;
			prevCoords.push(coords);
			getMatch(prevCoords)
		});
	},[socket])

	async function getMatch(coordinates){
		let newCoords = '';
		let radiuses = '';
		coordinates.forEach((x, index)=>{
			if(index<1){
				newCoords = x;
				radiuses = '25'
			}else if(index>0){
				newCoords = newCoords +';'+ x;
				radiuses = radiuses+';'+'25'
			}
		});
		const query = await fetch(`https://api.mapbox.com/matching/v5/mapbox/driving/${newCoords}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,{method:'GET'});
		const response = await query.json();
		if (response.code !== 'Ok') {
			alert(`${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`);
			return;
		}
		
		let tempMapData = mapData;
		tempMapData.features[0].geometry.coordinates = response.matchings[0].geometry.coordinates;
		setMapData(tempMapData)
		map.getSource('trace').setData(mapData);
		map.panTo(response.matchings[0].geometry.coordinates[(response.matchings[0].geometry.coordinates.length)-1]);
	}

  return (
    <div className='box'>
      	<div ref={mapContainer} style={{width:'80vw', height:'70vh', borderRadius:5, border:'1px solid black'}}></div>
	</div>
  )
}

export default MapComp