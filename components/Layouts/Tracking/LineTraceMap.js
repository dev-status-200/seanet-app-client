import React, { useState, useEffect, useRef, Spinner } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

//const socket = io.connect("http://localhost:8080/");
mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWh0ZWFtaGFpbCIsImEiOiJjbDdvbGtucjEwNm91M3ZueGZwaTEwcDg4In0.Be48QvgVjJ5-MNt3pzEnfw';

const LineTraceMap = ({selectedRider}) => {
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
	});

	useEffect(() => {
		map = new mapboxgl.Map({
			container:mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',//'mapbox://styles/mapbox/dark-v10',
			center:[67.06514346480135, 24.873956517462556],
			zoom: 15
		});
		map.on('load', async () => {
            map.resize();
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
		});

		// setTimeout( function(){
		// 	 axios.get('http://localhost:8080/riders/getRoute',{ headers:{ id:`${selectedRider}` }}).then((x)=>{ getMatch(x.data.result.Item.routes) })
		//   }, 1000)

		const interval = setInterval(() => {
			axios.get('http://localhost:8080/riders/getRoute',{ headers:{ id:`${selectedRider}` }}).then((x)=>{ getMatch(x.data.result.Item.routes) })
		}, 5000);

		return () => clearInterval(interval);

	}, [selectedRider])

  	// useEffect(() => {
	// 	socket.on("receive_message", async(data) => {
	// 		let prevCoords = data.coordsList;
    //         prevCoords.unshift([67.06514346480135, 24.873956517462556])
    //         getMatch(prevCoords);
	// 	});
	// },[socket])

	async function getMatch(coordinates){
		let limit = 0;
		let parsedCoords = [];
		if(coordinates.length>100){
			limit = (coordinates.length/98);
			if(limit-parseInt(limit)>0.5){ limit = parseInt(limit)+2 } else { limit = parseInt(limit)+1 }
			coordinates.forEach((x, index) => {
				if(index%limit==0){
					console.log(true)
					parsedCoords.push(x)
				}
			});
		}else{
			parsedCoords=coordinates
		}

		let newCoords = '';
		let radiuses = '';
		parsedCoords.forEach((x, index)=>{
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
		if(response.code === 'Ok'){
			let tempMapData = mapData;
			tempMapData.features[0].geometry.coordinates = response.matchings[0].geometry.coordinates;
			setMapData(tempMapData)
			map.getSource('trace').setData(mapData);
			map.panTo(response.matchings[0].geometry.coordinates[(response.matchings[0].geometry.coordinates.length)-1]);
			
			let tempMarkerData = markerData;
			tempMarkerData.features[0].geometry.coordinates = response.matchings[0].geometry.coordinates[0]
			tempMarkerData.features[1].geometry.coordinates = response.matchings[0].geometry.coordinates[(response.matchings[0].geometry.coordinates.length)-1]
			setMarkerData(tempMarkerData)

			map.getSource('points').setData(tempMarkerData);
		}
	}

  return (
    <>
      	<div ref={mapContainer} style={{width:'70vw', height:'62vh', border:'1px solid silver', borderRadius:5}}></div>
	</>
  )
}

export default LineTraceMap;