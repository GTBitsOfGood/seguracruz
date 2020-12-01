import React, {useEffect, useState} from 'react';
import {Table, Button} from 'semantic-ui-react';
import {map} from 'lodash';
import FileSaver from 'file-saver';
import {CSVDownload, CSVLink} from 'react-csv';
import './ReportsTable.css';

function ReportsTable(props) {

  const [csv, setCSV] = useState([]);

  useEffect(() => {
    let headers = ['Date', 'Time', 'Vehicles', 'Factors', 'Injury', 'Injury Description', 'First Aid']
    let content = [headers]
    if (props.data !== null) {
      map(props.data.features, (report, i) => {
        console.log(report)
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
  }, [props.data])

  return (
    <div id="table">
      <div id='table-heading'>
        <h2>Reports</h2>
        <CSVLink data={csv} download='data.csv'><Button primary>Download</Button></CSVLink>
      </div>  
      <div id='table-container'>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Vehicles</Table.HeaderCell>
              <Table.HeaderCell>Factors</Table.HeaderCell>
              <Table.HeaderCell>Injury</Table.HeaderCell>
              <Table.HeaderCell>Injury Description</Table.HeaderCell>
              <Table.HeaderCell>First Aid</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { props.data &&
              map(props.data.features, (report, i) => (
                <Table.Row key={i} onClick={() => props.setNewCoords([report.geometry.coordinates[0], report.geometry.coordinates[1]])}>
                  <Table.Cell>{new Date(report.properties.timestamp).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{new Date(report.properties.timestamp).toLocaleTimeString()}</Table.Cell>
                  <Table.Cell>{report.properties.vehicles}</Table.Cell>
                  <Table.Cell>{report.properties.factors}</Table.Cell>
                  <Table.Cell>{report.properties.injury}</Table.Cell>
                  <Table.Cell>{report.properties.injury_description}</Table.Cell>
                  <Table.Cell>{report.properties.injury_first_aid}</Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ReportsTable
