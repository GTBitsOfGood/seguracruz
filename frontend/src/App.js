import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';

import Filters from './filters/Filters';
import ReportsTable from './reports_table/ReportsTable';

mapboxgl.accessToken = "pk.eyJ1IjoibWljaGFlbC1rMTAxIiwiYSI6ImNqajBkMXNmbDBnbzAza2x6Mnp1Mjl5YWIifQ.K5e1fvORu0_ZfSPH4cGlNA"

function App() {
  const mapboxElRef = useRef(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('/api/reports')
      .then(response => response.json())
      .then(data => {
        const map = new mapboxgl.Map({
          container: mapboxElRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [-63.1813, -17.7850],
          zoom: 12
        });
        map.addControl(new mapboxgl.NavigationControl());
        for (let i = 0; i < data.length; i++) {
          let popup = new mapboxgl.Popup({ offset: 25 }).setText(
            data[i].datetime + "\n" + data[i].vehicles
          );
          new mapboxgl.Marker()
            .setLngLat([data[i].lon, data[i].lat])
            .setPopup(popup)
            .addTo(map);
        }
        setReports(data);
        console.log(data);
      })
  }, []);

  return (
    <div className="app">
      <Filters />
      <div className='data-panel'>
        <div id="map" ref={mapboxElRef}/>
        <ReportsTable data={reports}/>
      </div>
    </div>
  );
}

export default App;
