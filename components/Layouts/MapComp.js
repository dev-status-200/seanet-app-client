import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import io from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_SEANET_SYS_URL);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWh0ZWFtaGFpbCIsImEiOiJjbDdvbGtucjEwNm91M3ZueGZwaTEwcDg4In0.Be48QvgVjJ5-MNt3pzEnfw';

function MapComp() {
  const mapContainer = useRef();

  const [long, setLong] = useState('');
  const [lat, setLat] = useState('');

  useEffect(() => {
	const map = new mapboxgl.Map({
		container:mapContainer.current,
		style: 'mapbox://styles/mapbox/dark-v10',
		center:[
			67.06765895742515,
			24.877320553480782
	  ],
		zoom: 15
	  })
	  map.on('load', async () => {
		  let data = {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: {
						type: "LineString",
						coordinates: [
							[
								67.06765895742515,
								24.877320553480782
							],
						]
					}
				}
			]
		}
		  map.addSource('trace', { type: 'geojson', data: data });
		  map.addLayer({
			  'id': 'trace',
			  'type': 'line',
			  'source': 'trace',
			  'paint': {
				  'line-color': 'yellow',
				  'line-opacity': 0.75,
				  'line-width': 3
			  }
		  });

		  let coords = []
		  socket.on("receive_message", (datas) => {
			console.log(parseFloat(datas.long), parseFloat(datas.lat));
			console.log(datas.long, datas.lat);
				 coords = [ parseFloat(datas.long), parseFloat(datas.lat) ]

				 data.features[0].geometry.coordinates.push(coords);
				 map.getSource('trace').setData(data);
				 map.panTo(coords);
		  });
		}
	  );

	},[socket])

	const sendMessage = () => {
	  socket.emit("send_message", {lat:lat, long:long});
	};

  return (
    <div className='box'>
      <div ref={mapContainer} style={{width:'80vw', height:'70vh', borderRadius:5, border:'1px solid black'}}></div>
	<input value={lat} onChange={(e)=>setLat(e.target.value)} placeholder='lattitude' />
	<input value={long} onChange={(e)=>setLong(e.target.value)} placeholder='longitude' />
	<button onClick={sendMessage}>Click</button>
	</div>
  )
}

export default MapComp