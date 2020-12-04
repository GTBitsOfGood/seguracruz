import React, {useEffect, useState} from 'react';
import './App.css';

import Filters from './filters/Filters';
import ReportsTable from './reports_table/ReportsTable';
import Map from './map/Map';
import { filter, isEqual} from 'lodash';
import {fromDate, toDate, entities, factors, injury, injuryDescription, injuryFirstAid} from '../model/constants';

const INITIAL_FILTERS = {
  from: null,
  to: null,
  entities: [],
  factors: [],
  injury: [],
  injuryDescription: [],
  injuryFirstAid: []
}

function App() {

  const [reports, setReports] = useState({"type": "FeatureCollection", "features": []});
  const [filteredReports, setFilteredReports] = useState({"type": "FeatureCollection", "features": []});
  const [newCoords, setNewCoords] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    from: null,
    to: null,
    entities: [],
    factors: [],
    injury: [],
    injuryDescription: [],
    injuryFirstAid: []
  });

  // Update coordinates of the map
  function updateCoords(coords) {
    setNewCoords(coords);
  }

  // Update filter state
  function updateFilters() {
    let newReports = [];
    if (reports.length < 1) { return }
    for (const report of reports.features) {
      let reportProps = report.properties;
      let isReportInFilter = false;

      if (filterOptions.from !== null) {
        let reportDate = new Date(reportProps.timestamp).getTime();
        let fromDate = new Date(filterOptions.from).getTime();
        if (reportDate >= fromDate) {
          isReportInFilter = true;
        } else {
          isReportInFilter = false;
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.to !== null) {
        let reportDate = new Date(reportProps.timestamp).getTime();
        let toDate = new Date(filterOptions.to).getTime();
        if (reportDate <= toDate) {
          isReportInFilter = true;
        } else {
          isReportInFilter = false;
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.entities.length > 0) {
        let entities = reportProps.entities.split(',')
        for(const v of filterOptions.entities) {
          if (entities.includes(v)) {
            isReportInFilter = true;
          } else {
            isReportInFilter = false;
            break;
          }
        }
        if (!isReportInFilter) { continue; };
      }

      if (filterOptions.factors.length > 0) {
        let factors = reportProps.factors.split(',')
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
        let injury = reportProps.injury
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

      if (filterOptions.injuryDescription.length > 0) {
        if (reportProps.injury === 1) {
          let description = reportProps.injuryDescription
          for(const id of filterOptions.injuryDescription) {
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

      if (filterOptions.injuryFirstAid.length > 0) {
        if (reportProps.injury === 1) {
          let first_aid = reportProps.injuryFirstAid
          for(const fa of filterOptions.injuryFirstAid) {
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
  }

  // Handle filter when it is toggled
  function handleFilter(event, data) {
    let filterState = filterOptions;
    switch(data.name) {
      case fromDate.name:
        filterState.from = data.value
        break;
      case toDate.name:
        filterState.to = data.value
        break;
      case entities.name:
        if (data.checked) {
          filterState.entities.push(data.label.toLowerCase())
        } else {
          filterState.entities = filter(filterState.vehicles, (vehicle) => vehicle !== data.label.toLowerCase())
        }
        break;
      case factors.name:
        if (data.checked) {
          filterState.factors.push(data.label.toLowerCase())
        } else {
          filterState.factors = filter(filterState.factors, (factor) => factor !== data.label.toLowerCase())
        }
        break;
      case injury.name:
        if (data.checked) {
          filterState.injury.push(data.label.toLowerCase())
        } else {
          filterState.injury = filter(filterState.injury, (injury) => injury !== data.label.toLowerCase())
        }
        break;
      case injuryDescription.name:
        if (data.checked) {
          filterState.injuryDescription.push(data.label.toLowerCase())
        } else {
          filterState.injuryDescription = filter(filterState.injuryDescription, (injuryDescription) => injuryDescription !== data.label.toLowerCase())
        }
        break;
      case injuryFirstAid.name:
        if (data.checked) {
          filterState.injuryFirstAid.push(data.label.toLowerCase())
        } else {
          filterState.injuryFirstAid = filter(filterState.injuryFirstAid, (injuryFirstAid) => injuryFirstAid !== data.label.toLowerCase())
        }
        break;
      default:
        break;
    }
    setFilterOptions({...filterState});
  }

  // Get reports each time page loads
  useEffect(() => {
    fetch('/api/reports')
      .then(response => response.json())
      .then(data => {
        setReports(data);
        setFilteredReports(data);
      });
  }, []);

  // Update filters
  useEffect(() => {
    updateFilters()
  }, [filterOptions, reports])

  return (
    <div className="app">
      <Filters handleFilter={handleFilter} />
      <div className='data-panel'>
        <Map data={filteredReports} newCoords={newCoords}/>
        <ReportsTable data={filteredReports} updateCoords={updateCoords}/>
      </div>
    </div>
  );
}

export default App;
