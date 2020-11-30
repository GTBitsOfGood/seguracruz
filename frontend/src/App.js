import React, {useEffect, useState} from 'react';
import './App.css';

import Filters from './filters/Filters';
import ReportsTable from './reports_table/ReportsTable';
import Map from './map/Map';

function App() {

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  
  // First time page loads.
  useEffect(() => {
    fetch('/api/reports')
      .then(response => response.json())
      .then(data => {
        setReports(data);
        setFilteredReports(data);
        console.log(data);
      })
  }, []);

  return (
    <div className="app">
      <Filters />
      <div className='data-panel'>
        <Map />
        <ReportsTable data={reports}/>
      </div>
    </div>
  );
}

export default App;
