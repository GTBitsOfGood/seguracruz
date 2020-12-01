import React, {useEffect, useState} from 'react';
import './App.css';

import Filters from './filters/Filters';
import ReportsTable from './reports_table/ReportsTable';
import Map from './map/Map';
import { filter } from 'lodash';

function App() {

  const [reports, setReports] = useState(null);
  const [filteredReports, setFilteredReports] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    from: null,
    to: null,
    vehicles: [],
    factors: [],
    injury: [],
    injury_description: [],
    injury_first_aid: []
  });
  const [newCoords, setNewCoords] = useState([]);

  function assignCoords(coords) {
    console.log(coords)
    setNewCoords(coords)
  }
  
  // First time page loads.
  useEffect(() => {
    fetch('/api/reports')
      .then(response => response.json())
      .then(data => {
        setReports(data);
        setFilteredReports(data);
      });
  }, []);

  useEffect(() => {
    let newReports = [];
    if (reports === null) { return }
    console.log(filterOptions)
    for (const report of reports.features) {
      let report_props = report.properties;

      if (filterOptions.from !== null && filterOptions.to !== null) {
        let report_date = new Date(report_props.timestamp).getTime();
        let from_date = new Date(filterOptions.from).getTime();
        let to_date = new Date(filterOptions.to).getTime();
        if (report_date >= from_date && report_date <= to_date) {
          console.log(report)
          newReports.push(report)
          break;
        }
      }

      if (filterOptions.vehicles.length > 0) {
        let vehicles = report_props.vehicles.split(',')
        for(const v of filterOptions.vehicles) {
          if (vehicles.includes(v)) {
            newReports.push(report)
            break;
          }
        }
      }

      if (filterOptions.factors.length > 0) {
        let factors = report_props.factors.split(',')
        for(const f of filterOptions.factors) {
          if (factors.includes(f)) {
            newReports.push(report)
            break;
          }
        }
      }

      if (filterOptions.injury.length > 0) {
        let injury = filterOptions === "yes" ? 1 : 0
        if (injury === report_props.injury) {
          newReports.push(report);
          break;
        }
      }

      if (filterOptions.injury_description.length > 0) {
        let descriptions = report_props.injury_description.split(',')
        for(const id of filterOptions.injury_description) {
          if (descriptions.includes(id)) {
            newReports.push(report)
            break;
          }
        }
      }

      if (filterOptions.injury_first_aid.length > 0) {
        let first_aid = report_props.first_aid.split(',')
        for(const fa of filterOptions.first_aid) {
          if (first_aid.includes(fa)) {
            newReports.push(report)
            break;
          }
        }
      }

    }
    if (newReports.length > 0) {
      setFilteredReports({
        type: 'FeatureCollection', 
        features: newReports
      })
    } else {
      setFilteredReports({...reports})
    }
    
  }, [filterOptions, reports])

  function removeItem() {
    setFilteredReports({
      type: 'FeatureCollection', 
      features: filter(filteredReports.features, (feature) => { return feature.properties.factors === 'fatigue'})
    });
  }

  function handleFilter(event, data) {
    let filter_state = filterOptions;
    switch(data.name) {
      case "From":
        filter_state.from = data.value
        break;
      case "To":
        filter_state.to = data.value
        break;
      case "Vehicles":
        if (data.checked) {
          filter_state.vehicles.push(data.label.toLowerCase())
        } else {
          filter_state.vehicles = filter(filter_state.vehicles, (vehicle) => vehicle !== data.label.toLowerCase())
        }
        break;
      case "Factors":
        if (data.checked) {
          filter_state.factors.push(data.label.toLowerCase())
        } else {
          filter_state.factors = filter(filter_state.factors, (factor) => factor !== data.label.toLowerCase())
        }
        break;
      case "Injury":
        if (data.checked) {
          filter_state.injury.push(data.label.toLowerCase())
        } else {
          filter_state.injury = filter(filter_state.injury, (injury) => injury !== data.label.toLowerCase())
        }
        break;
      case "Injury Description":
        if (data.checked) {
          filter_state.injury_description.push(data.label.toLowerCase())
        } else {
          filter_state.injury_description = filter(filter_state.injury_description, (injury_description) => injury_description !== data.label.toLowerCase())
        }
        break;
      case "Injury First Aid":
        if (data.checked) {
          filter_state.injury_first_aid.push(data.label.toLowerCase())
        } else {
          filter_state.injury_first_aid = filter(filter_state.injury_first_aid, (injury_first_aid) => injury_first_aid !== data.label.toLowerCase())
        }
        break;
      default:
        break;

    }
    setFilterOptions({...filter_state});
  }

  return (
    <div className="app">
      <Filters handleFilter={handleFilter} />
      <div className='data-panel'>
        <Map data={filteredReports} removeItem={removeItem} newCoords={newCoords}/>
        <ReportsTable data={filteredReports} setNewCoords={assignCoords}/>
      </div>
    </div>
  );
}

export default App;
