/* See https://github.com/mapbox/mapbox-react-examples/ for full example */

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -83,
      lat: 40,
      zoom: 7,
      counties: [39049, 39159]
    };
  }

  componentDidMount() {
    const { lng, lat, zoom, counties } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });
    
    map.on('load', () => {
      map.addSource('counties', {
        'type': 'vector',
        'url': 'mapbox://mapbox.82pkq93d'
      });

      map.addLayer(
        {
          'id': 'counties',
          'type': 'fill',
          'source': 'counties',
          'source-layer': 'original',
          'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': 'rgba(0,0,0, 0.1)',
          }
        },
      );
    
    	
      map.addLayer(
        {
          'id': 'counties-highlighted',
          'type': 'fill',
          'source': 'counties',
          'source-layer': 'original',
          'paint': {
            'fill-color': 'rgba(138, 130, 173, 0.6)',
          },
          'filter': ['in', 'FIPS', ...counties]
        },
      );
    
    });

     map.on('move', () => {
      const { lng, lat } = map.getCenter();

       this.setState({
         lng: lng.toFixed(4),
         lat: lat.toFixed(4),
         zoom: map.getZoom().toFixed(2)
       });
     });
    
     map.on('click', 'counties', (e) => {
            map.getCanvas().style.cursor = 'pointer';

            // Use the first found feature.
            var feature = e.features[0];

						const {FIPS} = feature.properties;
            
            let updatedCounties;
            
            if(counties.includes(FIPS)) {
            	updatedCounties = counties.filter(el => el !== FIPS);
            } else {
            	updatedCounties = counties.concat([FIPS]);         
            }
            
            this.setState({
            	counties: updatedCounties
            });
            
            map.setFilter('counties-highlighted', [
            	'in',
            	'FIPS',
            ...updatedCounties
        	]);

        });
  }

  render() {
    const { lng, lat, zoom, counties } = this.state;

		const countyList = counties.map(el => el);

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom} Counties: ${countyList}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));