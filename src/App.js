import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import MapContainer from './MapContainer';

// API key of the google map
const GOOGLE_MAP_API_KEY = 'AIzaSyCjcpd5xLXdmX3Y9CyNZDxUi4Q6ND3kyec';

const App = () => {
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const options = {
      apiKey: GOOGLE_MAP_API_KEY,
      version: "weekly",
      libraries: ['geometry']
    };

    new Loader(options).load().then(() => {
      setLoadMap(true);
    }).catch(e => {
      console.error('Sorry, something went wrong: Please try again later. Error:', e);
    });
  }, []);

  return (
    <div>
      {loadMap ? <MapContainer /> : <div>Loading Map...</div>}
    </div>
  );
}

export default App;
