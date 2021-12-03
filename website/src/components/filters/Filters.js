import React, {useState} from 'react'
import {Form, Grid, Icon, Label} from 'semantic-ui-react';
import SemanticDatepicker from "react-semantic-ui-datepickers";
import {Range} from 'rc-slider';
import {filters} from '../../model/filters.js';
import {map} from 'lodash';
import 'rc-slider/assets/index.css';
import './Filters.scss';

function Filters(props) {

  const [fromTime, setFromTime] = useState(0);
  const [toTime, setToTime] = useState(24);

  function updateTimeLabels(event) {
    setFromTime(event[0])
    setToTime(event[1])
  }

  return (
    <div className="filters">
      <h1><Icon name='filter'/> Filtros</h1>
      <Form>
        { map(filters, (filter, i) => (
            <Form.Group key={i} grouped>
              <h3>{filter.name}</h3>
              { filter.type === 'date' &&
                <SemanticDatepicker name={filter.name} locale="es-ES" onChange={props.handleFilter} />
              }
              { filter.type === 'check' &&
                map(filter.options, (option, j) => {
                  return <Form.Checkbox key={j} name={filter.name} label={option} onChange={props.handleFilter} />
                })
              }
              { filter.type === 'time' &&
                <Grid columns={2} className='timeGrid'>
                  <Grid.Row>
                    <Grid.Column>
                      <Label>{fromTime}:00</Label>
                    </Grid.Column>
                    <Grid.Column textAlign={"right"}>
                      <Label>{toTime}:00</Label>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Range 
                      name='time'
                      className='timeSlider'
                      min={0}
                      max={24}
                      step={1}
                      defaultValue={[0, 24]}
                      allowCross={false}
                      onChange={(event) => updateTimeLabels(event)}
                      onAfterChange={props.handleSliderFilter}
                    />
                  </Grid.Row>
                </Grid>
                
              }
            </Form.Group>
          ))
        }
      </Form>
    </div>
  )
}

export default Filters
