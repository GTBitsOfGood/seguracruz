import React, {useEffect, useState, useRef} from 'react';
import {Table, Button, Message, Dropdown, Label, Grid} from 'semantic-ui-react';
import {map, values} from 'lodash';
import {headers, csvHeaders} from '../../model/constants';
import {CSVLink} from 'react-csv';
import './ReportsTable.css';

function ReportsTable(props) {

  const [csvData, setCsvData] = useState([]);
  const csvLink = useRef(null);
  const jsonLink = useRef(null);

  function downloadCSV() {
    csvLink.current.link.click();
  }

  function downloadGeoJSON() {
    jsonLink.current.click();
  }

  useEffect(() => {
    console.log(csvHeaders)
  }, [])

  useEffect(() => {
    let content = [values(headers)]
    if (props.data !== null) {
      map(props.data.features, (report, i) => {
        let info = report.properties;
        let row = [
          new Date(info.timestamp).toLocaleDateString(),
          new Date(info.timestamp).toLocaleTimeString(),
          info.entities,
          info.factors,
          info.injury,
          info.injury_description,
          info.injury_first_aid
        ]
        content.push(row);
      })
      setCsvData(content);
    }
  }, [props.data])

  return (
    <div id="table">
      <Grid className='table-heading' columns={3}>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column textAlign='left'>
            <h2>Informes</h2>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Label size='large'>{props.data.features.length} total</Label>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Button.Group color='blue'>
              <Dropdown
                text='Opciones'
                icon='chevron down'
                labeled
                button
                className='icon'
              >
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => downloadCSV()}>
                    Descargar CSV
                    <CSVLink className='download-csv' data={csvData} download='data.csv' ref={csvLink}>CSV</CSVLink>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => downloadGeoJSON()}>
                    Descargar GeoJSON
                    <a 
                      className='download-json' 
                      ref={jsonLink} 
                      href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(props.data))}`} 
                      download="data.json">
                        GeoJSON
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={props.logout}>
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>  
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
                      <Table.Cell>{new Date(report.properties.timestamp).toLocaleDateString('es-ES')}</Table.Cell>
                      <Table.Cell>{new Date(report.properties.timestamp).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</Table.Cell>
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
