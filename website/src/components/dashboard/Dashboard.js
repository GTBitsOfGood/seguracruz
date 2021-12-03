import React, {useEffect, useState} from 'react';
import Filters from '../filters/Filters';
import ReportsTable from '../reports_table/ReportsTable';
import Map from '../map/Map';
import {filter, isEqual} from 'lodash';
import {fromDate, toDate, entities, factors, injury, injuryDescription, injuryFirstAid} from '../../model/constants';
import './Dashboard.scss';
import { Button, Icon, Form, Message } from 'semantic-ui-react';

const INITIAL_FILTERS = {
  from: null,
  to: null,
  time: [],
  entities: [],
  factors: [],
  injury: [],
  injuryDescription: [],
  injuryFirstAid: []
}

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState({"type": "FeatureCollection", "features": []});
  const [filteredReports, setFilteredReports] = useState({"type": "FeatureCollection", "features": []});
  const [newCoords, setNewCoords] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    from: null,
    to: null,
    time: [],
    entities: [],
    factors: [],
    injury: [],
    injuryDescription: [],
    injuryFirstAid: []
  });

  // Login user
  function login() {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: id, password: password}),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === 1) {
        setShowLoginError(false);
        setLoggedIn(true);
        setId('');
        setPassword('');
      } else {
        setShowLoginError(true);
        setLoggedIn(false);
      }
    });
  }

  // Logout user
  function logout() {
    fetch('/api/auth/logout', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === 1) {
        setLoggedIn(false)
      }
    });
  }

  // Update id and password fields while typing
  function handleFormChange(event) {
    if (event.target.name === 'id') {
      setId(event.target.value);
    }

    if (event.target.name === 'password') {
      setPassword(event.target.value);
    }
  }

  // Get reports each time user logs in
  useEffect(() => {
    if (!loggedIn) return;
    fetch('/api/reports')
    .then(response => response.json())
    .then(data => {
      setReports(data.data);
      setFilteredReports(data.data);
    });
  }, [loggedIn]);

  // Check user is still logged in every time page refreshes
  useEffect(() => {
    fetch('/api/auth/verify', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === 1) {
        setShowLoginError(false);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        setReports({"type": "FeatureCollection", "features": []});
        setFilteredReports({"type": "FeatureCollection", "features": []});
      }
    });
  }, []);

  // Update coordinates of the map
  function updateCoords(coords) {
    setNewCoords(coords);
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
          filterState.entities = filter(filterState.entities, (entity) => entity !== data.label.toLowerCase())
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

  function handleSliderFilter(event) {
    let filterState = filterOptions;
    filterState.time = event
    setFilterOptions({...filterState});
  }

   // Update filters
   useEffect(() => {
    if (!loggedIn) return;
    let newReports = [];
    if (reports.length < 1) { return }
    for (const report of reports.features) {
      let reportProps = report.properties;
      let isReportInFilter = false;

      if (filterOptions.from !== null) {
        let reportDate = new Date(reportProps.timestamp).getTime();
        let fromDate = new Date(filterOptions.from).getTime();
        console.log(new Date(reportProps.timestamp).getHours());
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

      if (filterOptions.time.length > 0) {
        let reportHours = new Date(reportProps.timestamp).getHours();
        if (reportHours >= filterOptions.time[0] && reportHours < filterOptions.time[1]) {
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
        for(const i of filterOptions.injury) {
          let injury_num = i === "no" ? 0 : 1
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
          let description = reportProps.injury_description
          for(const id of filterOptions.injuryDescription) {
            if (description === id) {
              isReportInFilter = true;
              console.log("YRES")
            } else {
              isReportInFilter = false;
              break;
            }
          }
          if (!isReportInFilter) { continue; };
        } else {
          isReportInFilter = false;
        }
      }

      if (filterOptions.injuryFirstAid.length > 0) {
        if (reportProps.injury === 1) {
          let first_aid = reportProps.injury_first_aid
          for(const fa of filterOptions.injuryFirstAid) {
            if (first_aid === fa) {
              isReportInFilter = true
            } else {
              isReportInFilter = false;
              break;
            }
          }
          if (!isReportInFilter) { continue; };
        } else {
          isReportInFilter = false;
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
  }, [filterOptions, reports, loggedIn])

  return (
    <div className="app">
      { loggedIn
        ? <div>
            <Filters handleFilter={handleFilter} handleSliderFilter={handleSliderFilter}/>
            <div className='data-panel'>
              <Map data={filteredReports} newCoords={newCoords}/>
              <ReportsTable data={filteredReports} updateCoords={updateCoords} logout={logout}/>
            </div>
          </div>
        : <div> 
            <div className='home-nav'>
              <h2 className="header-title"><a href='/'>SeguraCruz</a></h2>
              <a href='#/dash'>
                <button className='dash-button'>Dashboard <Icon name='sign-in'/></button>
              </a>
            </div>
            <div className='login'>
              <h3>Dashboard Login</h3>
              <Form className='login-form'>
                <Form.Input
                  name='id'
                  control='input'
                  placeholder='ID'
                  onChange={handleFormChange}
                />
                <Form.Input
                  name='password'
                  control='input'
                  type='password'
                  placeholder='Contraseña'
                  onChange={handleFormChange}
                />
                { showLoginError &&
                  <Message color='red'>
                  <Message.Header>
                    Usuario o contraseña incorrectos. Inténtalo de nuevo.
                  </Message.Header>
                  </Message>
                }
                <Button 
                  className='login-button' 
                  icon 
                  labelPosition='right' 
                  onClick={() => login()}
                  type='submit'>
                    Inicia sesión <Icon name='right arrow' />
                </Button>
              </Form>
            </div>
          </div>
         
      }
    </div>
  );
}