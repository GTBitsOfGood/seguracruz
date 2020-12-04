export const headers = {
  DATE: 'Date',
  TIME: 'Time',
  ENTITIES: 'Entities',
  FACTORS: 'Factors',
  INJURY: 'Injury',
  INJURY_DESCRIPTION: 'Injury Description',
  INJURY_FIRST_AID: 'First Aid'
}

export const fromDate = {
  name: 'From',
}

export const toDate = {
  name: 'To'
}

export const entities = {
  name: 'Entities',
  options: {
    PRIVATE_VEHICLE: 'Private vehicle',
    CAB: 'Cab',
    MICRO_BUS: 'Micro bus',
    MOTORCYCLE: 'Motorcycle',
    TRUCK: 'Truck',
    BICYCLE: 'Bicycle',
    PEDESTRIAN: 'Pedestrian',
    OBJECT_OR_BUILDING: 'Object or building'
  }
}

export const factors = {
  name: 'Factors',
  options: {
    LIGHT: 'Lack of light',
    SIGNAGE: 'Lack of signage',
    WEATHER: 'Weather',
    ALCOHOL_DRUGS: 'Alcohol or drugs',
    TALK_TEXT: 'Talking or texting',
    SEAT_BELT: 'Lack of seat belt',
    FATIGUE: 'Fatigue',
    NONE: 'None'
  }
}

export const injury = {
  name: 'Injury',
  options: {
    YES: 'Yes',
    NO: 'No'
  }
}

export const injuryDescription = {
  name: 'Injury Description',
  options: {
    CONSCIOUS: 'Conscious',
    UNCONSCIOUS: 'Unconscious',
    DECEASED: 'Deceased'
  }
}

export const injuryFirstAid = {
  name: 'Injury First Aid',
  options: {
    INDVIDUAL: 'Individual',
    EMERGENCY_SERVICES: 'Emergency services',
    NO: 'No',
    NO_HELP_NEEDED: 'No help needed'
  }
}