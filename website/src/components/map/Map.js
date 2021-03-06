import React, {useState, useRef, useEffect} from 'react'
import ReactMapGL, { Source, Layer, NavigationControl} from 'react-map-gl';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './Layers';

function Map(props) {

  const accessToken = "replace_with_mapbox_key"
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
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  };

  useEffect(() => {
    if (props.newCoords.length > 0) {
      setViewport({
        longitude: props.newCoords[0],
        latitude: props.newCoords[1],
        zoom: 13,
        transitionDuration: 500
      });
    }
  }, [props.newCoords])

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
      <div style={{position: 'absolute', right: 35, top: 5}}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  )
}

export default Map;
