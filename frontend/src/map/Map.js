import React, {useState} from 'react'
import ReactMapGL from 'react-map-gl';

function Map() {

  const accessToken = "pk.eyJ1IjoibWljaGFlbC1rMTAxIiwiYSI6ImNqajBkMXNmbDBnbzAza2x6Mnp1Mjl5YWIifQ.K5e1fvORu0_ZfSPH4cGlNA"

  const [viewport, setViewport] = useState({
    latitude: -17.7850,
    longitude: -63.1813,
    zoom: 12
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="60vh"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={accessToken}
    />
  )
}

export default Map;
