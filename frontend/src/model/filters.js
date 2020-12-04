
import {values} from 'lodash';
import {fromDate, toDate, entities, factors, injury, injuryDescription, injuryFirstAid} from './constants';

export const filters = [
  {
    name: fromDate.name,
    type: 'date'
  },
  {
    name: toDate.name,
    type: 'date'
  },
  {
    name: entities.name,
    type: 'check',
    options: values(entities.options)
  },
  {
    name: factors.name,
    type: 'check',
    options: values(factors.options)
  },
  {
    name: injury.name,
    type: 'check',
    options: values(injury.options)
  },
  {
    name: injuryDescription.name,
    type: 'check',
    options: values(injuryDescription.options)
  },
  {
    name: injuryFirstAid.name,
    type: 'check',
    options: values(injuryFirstAid.options)
  }
]