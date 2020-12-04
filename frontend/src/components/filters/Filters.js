import React from 'react'
import {Form, Icon} from 'semantic-ui-react';
import SemanticDatepicker from "react-semantic-ui-datepickers";
import './Filters.css';
import { filters } from '../../model/filters.js';
import { map } from 'lodash';

function Filters(props) {

  return (
    <div className="filters">
      <h1><Icon name='filter'/> Filtros</h1>
      <Form>
        { map(filters, (filter, i) => (
            <Form.Group key={i} grouped>
              <h3>{filter.name}</h3>
              { filter.type === "date"
                ? <SemanticDatepicker name={filter.name} locale="es-ES" onChange={props.handleFilter} />
                : map(filter.options, (option, j) => {
                    return <Form.Checkbox key={j} name={filter.name} label={option} onChange={props.handleFilter} />
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
