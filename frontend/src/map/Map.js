import React, {useState, useRef, useEffect} from 'react'
import ReactMapGL, { Source, Layer, NavigationControl} from 'react-map-gl';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './Layers';

function Map(props) {

  const accessToken = "pk.eyJ1IjoibWljaGFlbC1rMTAxIiwiYSI6ImNqajBkMXNmbDBnbzAza2x6Mnp1Mjl5YWIifQ.K5e1fvORu0_ZfSPH4cGlNA"
  const sourceRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: -17.7850,
    longitude: -63.1813,
    zoom: 12
  });

  function _onClick(event) {
    if (event.features.length === 0) {
      return;
    }

    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;
    const mapboxSource = sourceRef.current.getSource();

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  };

  useEffect(() =>{
    console.log("-----------------------")
    console.log(props.data);
  }, [props]);

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="60vh"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={accessToken}
      interactiveLayerIds={[clusterLayer.id]}
      onClick={_onClick}
    >
      { props.data && 
        <Source 
          id='reports-data'
          type='geojson' 
          data={props.data}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          ref={sourceRef}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      }
      <div style={{position: 'absolute', right: 5, top: 5}}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  )
}

export default Map;
