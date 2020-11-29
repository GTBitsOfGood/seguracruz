
const db = require('../db');

module.exports = {
  selectAllRecords: () => {
    let sql = "select * from reports";
    return db.query(sql);
  },
  selectRecord: (id) => {
    let sql = "select * from reports where id = (?)";
    return db.query(sql, id);
  },
  insertRecord: (date) => {
    let sql = "insert into reports (datetime, vehicles, factors, injury, injury_description, injury_first_aid, lat, lon) values (?, default, default, default, default, default, default, default)";
    return db.query(sql, date);
  },
  updateValues: (keyFields, id) => {
    let sql = `update reports set ${keyFields} where id = ${id}`;
    console.log(sql);
    return db.query(sql);
  },
  createKeyFields: (fields, values) => {
    let result = "";
    for (let i = 0; i < fields.length; i++) {
      if (i === fields.length - 1) {
        result = result.concat(fields[i] + "=\'" + values[i] + "\'")
      } else {
        result = result.concat(fields[i] + "=\'" + values[i] + '\', ')
      }
    }
    return result;
  }
}


