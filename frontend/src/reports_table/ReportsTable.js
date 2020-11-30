import React from 'react';
import {Table, Button} from 'semantic-ui-react';
import {map} from 'lodash';
import './ReportsTable.css';

function ReportsTable(props) {

  return (
    <div id="table">
      <div id='table-heading'>
        <h2>Reports</h2>
        <Button primary>Download</Button>
      </div>  
      <div id='table-container'>
        <Table celled>
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
                <Table.Row key={i}>
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
