
import {values} from 'lodash';
import {filtersTitle, fromDate, toDate, vehicles, factors, injury, injuryDescription, injuryFirstAid} from './constants';

let locale = 'en';

export const filters = {
  title: filtersTitle.name[locale],
  filters: [
    {
      name: fromDate.name[locale],
      type: 'date'
    },
    {
      name: toDate.name[locale],
      type: 'date'
    },
    {
      name: vehicles.name[locale],
      type: 'check',
      options: values(vehicles.options[locale])
    },
    {
      name: factors.name[locale],
      type: 'check',
      options: values(factors.options[locale])
    },
    {
      name: injury.name[locale],
      type: 'check',
      options: values(injury.options[locale])
    },
    {
      name: injuryDescription.name[locale],
      type: 'check',
      options: values(injuryDescription.options[locale])
    },
    {
      name: injuryFirstAid.name[locale],
      type: 'check',
      options: values(injuryFirstAid.options[locale])
    }
  ]
}