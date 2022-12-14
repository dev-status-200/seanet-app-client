import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import io from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_SEANET_SYS_URL);

mapboxgl.accessToken='pk.eyJ1IjoiYWJkdWxsYWh0ZWFtaGFpbCIsImEiOiJjbDdvbGtucjEwNm91M3ZueGZwaTEwcDg4In0.Be48QvgVjJ5-MNt3pzEnfw';

function MapComp() {
  const mapContainer = useRef();
  let map;

  const [mapData, setMapData] = useState({
		type: "FeatureCollection",
		features: [{
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: [[67.06514346480135, 24.873956517462556]]
				}
			}]
		});
	const [markerData, setMarkerData] = useState({
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [67.06514346480135, 24.873956517462556]
				},
				properties: {
					title: 'Start Location'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [67.06514346480135, 24.875956517462556]
				},
				properties: {
					title: 'End Location'
				}
			}
		]
	})

	useEffect(() => {
		map = new mapboxgl.Map({
			container:mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',//'mapbox://styles/mapbox/dark-v10',
			center:[67.06514346480135, 24.873956517462556],
			zoom: 15
		})
		
		map.on('load', async () => {

			map.loadImage(
				'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
				(error, image) => {
					if (error) throw error;
					map.addImage('custom-marker', image);
					map.addSource('points', { type: 'geojson', data: markerData });
					map.addLayer({
						'id': 'points',
						'type': 'symbol',
						'source': 'points',
						'layout': {
							'icon-image': 'custom-marker',
							'text-field': ['get', 'title'],
							'text-font': [
								'Open Sans Semibold',
								'Arial Unicode MS Bold'
							],
							'text-offset': [0, 1.25],
							'text-anchor': 'top'
						}
					});
				}
			);

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
			getMatch(prevCoords);
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
		
		let tempMarkerData = markerData;
		
		console.log("Before Data Update")
		console.log(tempMarkerData)
		
		console.log(response.matchings[0].geometry.coordinates[(response.matchings[0].geometry.coordinates.length)-1])
		tempMarkerData.features[1].geometry.coordinates = response.matchings[0].geometry.coordinates[(response.matchings[0].geometry.coordinates.length)-1]
		console.log("After Data Update")
		console.log(tempMarkerData)
		setMarkerData(tempMarkerData)
		map.getSource('points').setData(tempMarkerData);
	}

  return (
    <div className='box'>
      	<div ref={mapContainer} style={{width:'80vw', height:'70vh', borderRadius:5, border:'1px solid black'}}></div>
	</div>
  )
}

export default MapComp

// let tempMarkerData = markerData;
// tempMarkerData.features[1].geometry.coordinates=[response.matchings[0].geometry.coordinates[(response.matchings[0].geometry.coordinates.length)-1]]
// setMarkerData(tempMarkerData)