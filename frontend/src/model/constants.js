export const headers = {
  DATE: 'Fecha',
  TIME: 'Tiempo',
  ENTITIES: 'Involucrados',
  FACTORS: 'Factores',
  INJURY: 'Lesión',
  INJURY_DESCRIPTION: 'Lesiones Descripción',
  INJURY_FIRST_AID: 'Primeros auxilios'
}

export const fromDate = {
  name: 'Desde',
}

export const toDate = {
  name: 'A'
}

export const time = {
  name: 'Tiempo'
}

export const entities = {
  name: 'Involucrados',
  options: {
    PRIVATE_VEHICLE: 'Vehículo privado',
    CAB: 'Taxi',
    MICRO_BUS: 'Micro bus',
    MOTORCYCLE: 'Moto',
    TRUCK: 'Camión',
    BICYCLE: 'Bicicleta',
    PEDESTRIAN: 'Peatón',
    OBJECT_OR_BUILDING: 'Objeto o edificio'
  }
}

export const factors = {
  name: 'Factores',
  options: {
    LIGHT: 'Falta de luz',
    SIGNAGE: 'Falta de señalización',
    WEATHER: 'Clima',
    ALCOHOL_DRUGS: 'Alcohol o drogas',
    TALK_TEXT: 'Hablando por teléfono o enviando mensaje de texto',
    SEAT_BELT: 'Falta de cinturón de seguridad',
    FATIGUE: 'Fatiga',
    NONE: 'Ninguno de esos'
  }
}

export const injury = {
  name: 'Lesión',
  options: {
    YES: 'Sí',
    NO: 'No'
  }
}

export const injuryDescription = {
  name: 'Lesiones Descripción',
  options: {
    CONSCIOUS: 'Consciente',
    UNCONSCIOUS: 'Inconsciente',
    DECEASED: 'Fallecido'
  }
}

export const injuryFirstAid = {
  name: 'Primeros auxilios',
  options: {
    INDVIDUAL: 'Una persona particular',
    EMERGENCY_SERVICES: 'Los servicios de emergencias',
    NO: 'No',
    NO_HELP_NEEDED: 'No era necesaria la ayuda'
  }
}