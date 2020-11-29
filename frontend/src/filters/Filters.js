import React from 'react'
import {Form, Label} from 'semantic-ui-react';
import SemanticDatepicker from "react-semantic-ui-datepickers";
import './Filters.css';

function Filters() {

  function selectDate(event, data) {
    console.log(data);
  }
  
  function selectToDate(event, data) {
    console.log(data);
  }
  
  return (
    <div className="filters">
      <h1>Filter</h1>
      <Form>
        <Label className="filter-label" color="green">From</Label>
        <SemanticDatepicker locale="pt-BR" onChange={selectDate} type="range" />
        <Form.Group grouped>
          <Label color="green">Vehicles</Label>
          <Form.Checkbox label='Private Vehicle' onChange={selectToDate} />
          <Form.Checkbox label='Cab' />
          <Form.Checkbox label='Micro bus' />
          <Form.Checkbox label='Motorcycle' />
          <Form.Checkbox label='Truck' />
          <Form.Checkbox label='Bicycle' />
          <Form.Checkbox label='Pedestrian' />
          <Form.Checkbox label='Object or building' />
        </Form.Group>
        <Form.Group grouped>
          <Label color="green">Factors</Label>
          <Form.Checkbox label='Lack of light' />
          <Form.Checkbox label='Lack of signage' />
          <Form.Checkbox label='Weather' />
          <Form.Checkbox label='Alcohol or drugs' />
          <Form.Checkbox label='Talking or texting' />
          <Form.Checkbox label='Lack of seat belt' />
          <Form.Checkbox label='Fatigue' />
          <Form.Checkbox label='None of those' />
        </Form.Group>
        <Form.Group grouped>
          <Label color="green">Injury</Label>
          <Form.Radio
            label='Yes'
            value='true'
          />
          <Form.Radio
            label='No'
            value='false'
          />
        </Form.Group>
        <Form.Group grouped>
          <Label color="green">Injury Description</Label>
          <Form.Checkbox label='Conscious (or "moves")' />
          <Form.Checkbox label='Unconscious (or "not moving")' />
          <Form.Checkbox label='Deceased' />
        </Form.Group>
        <Form.Group grouped>
          <Label color="green">First Aid</Label>
          <Form.Checkbox label='Yes, by an individual' />
          <Form.Checkbox label='Yes, by the emergency services' />
          <Form.Checkbox label='No' />
          <Form.Checkbox label='No help needed' />
        </Form.Group>
      </Form>
    </div>
  )
}

export default Filters
