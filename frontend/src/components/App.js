import React, {useEffect, useState} from 'react';
import './App.css';

import Filters from './filters/Filters';
import ReportsTable from './reports_table/ReportsTable';
import Map from './map/Map';
import { filter, isEqual} from 'lodash';

const INITIAL_FILTERS = {
  from: null,
  to: null,
  vehicles: [],
  factors: [],
  injury: [],
  injury_description: [],
  injury_first_aid: []
}

function App() {

  const [reports, setReports] = useState({"type": "FeatureCollection", "features": []});
  const [filteredReports, setFilteredReports] = useState({"type": "FeatureCollection", "features": []});
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
    if (reports.length < 1) { return }
    for (const report of reports.features) {
      let report_props = report.properties;
      let isReportInFilter = false;

      if (filterOptions.from !== null) {
        let report_date = new Date(report_props.timestamp).getTime();
        let from_date = new Date(filterOptions.from).getTime();
        if (report_date >= from_date) {
          isReportInFilter = true;
        } else {
          isReportInFilter = false;
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.to !== null) {
        let report_date = new Date(report_props.timestamp).getTime();
        let to_date = new Date(filterOptions.to).getTime();
        if (report_date <= to_date) {
          isReportInFilter = true;
        } else {
          isReportInFilter = false;
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.vehicles.length > 0) {
        let vehicles = report_props.vehicles.split(',')
        for(const v of filterOptions.vehicles) {
          if (vehicles.includes(v)) {
            isReportInFilter = true;
          } else {
            isReportInFilter = false;
            break;
          }
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.factors.length > 0) {
        let factors = report_props.factors.split(',')
        for(const f of filterOptions.factors) {
          if (factors.includes(f)) {
            isReportInFilter = true;
          } else {
            isReportInFilter = false;
            break;
          }
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.injury.length > 0) {
        let injury = report_props.injury
        console.log(injury)
        for(const i of filterOptions.injury) {
          let injury_num = i === "yes" ? 1 : 0
          if (injury === injury_num) {
            isReportInFilter = true;
          } else {
            isReportInFilter = false;
            break;
          }
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.injury_description.length > 0) {
        if (report_props.injury === 1) {
          let description = report_props.injury_description
          for(const id of filterOptions.injury_description) {
            if (description === id) {
              isReportInFilter = true;
            } else {
              isReportInFilter = false;
              break;
            }
          }
          if (!isReportInFilter) { continue; };
        }
      }

      if (filterOptions.injury_first_aid.length > 0) {
        if (report_props.injury === 1) {
          let first_aid = report_props.injury_first_aid
          for(const fa of filterOptions.injury_first_aid) {
            if (first_aid === fa) {
              isReportInFilter = true
            } else {
              isReportInFilter = false;
              break;
            }
          }
          if (!isReportInFilter) { continue; };
        }
      }

      if (isReportInFilter) {
        newReports.push(report);
        isReportInFilter = false;
      }
    }

    if (newReports.length < 1 && !isEqual(filterOptions, INITIAL_FILTERS)) {
      setFilteredReports({
        type: 'FeatureCollection', 
        features: []
      })
    } else if (newReports.length > 0 && !isEqual(filterOptions, INITIAL_FILTERS)) {
      setFilteredReports({
        type: 'FeatureCollection', 
        features: newReports
      })
    } else {
      setFilteredReports({...reports})
    }
    
  }, [filterOptions, reports])

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
        <Map data={filteredReports} newCoords={newCoords}/>
        <ReportsTable data={filteredReports} setNewCoords={assignCoords}/>
      </div>
    </div>
  );
}

export default App;
