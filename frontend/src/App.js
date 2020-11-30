import React, {useEffect, useState} from 'react';
import './App.css';

import Filters from './filters/Filters';
import ReportsTable from './reports_table/ReportsTable';
import Map from './map/Map';
import { Button } from 'semantic-ui-react';
import { filter } from 'lodash';

function App() {

  const [reports, setReports] = useState(null);
  const [filteredReports, setFilteredReports] = useState(null);
  
  // First time page loads.
  useEffect(() => {
    fetch('/api/reports')
      .then(response => response.json())
      .then(data => {
        setReports(data);
        setFilteredReports(data);
      });
  }, []);

  function removeItem() {
    setFilteredReports({
      type: 'FeatureCollection', 
      features: filter(filteredReports.features, (feature) => { return feature.properties.factors === 'fatigue'})
    });
  }

  return (
    <div className="app">
      <Filters />
      <div className='data-panel'>
        <Map data={filteredReports} removeItem={removeItem}/>
        <ReportsTable data={filteredReports}/>
      </div>
      <Button onClick={() => removeItem()}>Remove</Button>
    </div>
  );
}

export default App;
