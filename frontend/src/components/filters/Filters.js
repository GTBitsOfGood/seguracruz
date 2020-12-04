import React from 'react'
import {Form, Icon} from 'semantic-ui-react';
import SemanticDatepicker from "react-semantic-ui-datepickers";
import './Filters.css';
import filters from '../../res/filters.json';
import { map } from 'lodash';

function Filters(props) {

  return (
    <div className="filters">
      <h1><Icon name='filter'/> Filters</h1>
      <Form>
        { map(filters.filters, (filter) => (
            <Form.Group grouped>
              <h3>{filter.name}</h3>
              { filter.type === "date"
                ? <SemanticDatepicker name={filter.name} locale="pt-BR" onChange={props.handleFilter} />
                : map(filter.options, (option) => {
                    return <Form.Checkbox name={filter.name} label={option} onChange={props.handleFilter} />
                  })
              }
            </Form.Group>
          ))
        }
      </Form>
    </div>
  )
}

export default Filters
