import React, {useEffect, useState} from 'react';
import {Table, Button, Message, Dropdown, Icon} from 'semantic-ui-react';
import {map, values} from 'lodash';
import {headers} from '../../model/constants';
import {CSVLink} from 'react-csv';
import './ReportsTable.css';

function ReportsTable(props) {

  const [csv, setCSV] = useState([]);

  function updateCSV() {
    let content = [values(headers.en)]
    if (props.data !== null) {
      map(props.data.features, (report, i) => {
        let info = report.properties;
        let row = [
          new Date(info.timestamp).toLocaleDateString(),
          new Date(info.timestamp).toLocaleTimeString(),
          info.vehicles,
          info.factors,
          info.injury,
          info.injury_description,
          info.injury_first_aid
        ]
        content.push(row);
      })
      setCSV(content);
    }
  }

  function downloadGeoJSON(objectData) {
    let filename = "export.json";
    let contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], { type: contentType });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  useEffect(() => {
    updateCSV()
  }, [props.data])

  return (
    <div id="table">
      <div id='table-heading'>
        <h2>Informes</h2>
        <Button.Group color='blue'>
          <Dropdown
            text='Descargar'
            icon='download'
            floating
            labeled
            button
            className='icon'
          >
            <Dropdown.Menu>
              <Dropdown.Item><CSVLink data={csv} download='data.csv'>CSV</CSVLink></Dropdown.Item>
              <Dropdown.Item onClick={() => downloadGeoJSON(props.data)}>GeoJSON</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Button.Group>
        
      </div>  
      <div id='table-container'>
        { props.data.features.length > 0
          ? <Table celled selectable>
              <Table.Header>
                <Table.Row>
                  { map(headers, (header, i) => (
                      <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                    ))
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { map(props.data.features, (report, i) => (
                    <Table.Row key={i} onClick={() => props.updateCoords([report.geometry.coordinates[0], report.geometry.coordinates[1]])}>
                      <Table.Cell>{new Date(report.properties.timestamp).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>{new Date(report.properties.timestamp).toLocaleTimeString()}</Table.Cell>
                      <Table.Cell>{report.properties.entities}</Table.Cell>
                      <Table.Cell>{report.properties.factors}</Table.Cell>
                      <Table.Cell>{report.properties.injury}</Table.Cell>
                      <Table.Cell>{report.properties.injury_description}</Table.Cell>
                      <Table.Cell>{report.properties.injury_first_aid}</Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          : <Message negative>
              <Message.Header>Sin informes</Message.Header>
              <p>Se encontraron 0 informes en la base de datos.</p>
            </Message>
        }
      </div>
    </div>
  )
}

export default ReportsTable
