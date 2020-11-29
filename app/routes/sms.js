const errors = require('../res/errors.json');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const query = require('../res/query');
const questions = require('../res/questions.json');
const router = express.Router();
const winston = require('../res/winston');

router.post('/sms', (req, res) => {
  let message;
  let input = req.body.Body.toString().toLowerCase().trim();
  let smsCount = req.session.counter || 0;
  let insertId = req.session.insertId || null;
  let twiml = new MessagingResponse();
  console.log(smsCount)
  if (smsCount === 0) {
    req.session.counter = smsCount + 1;
    message = questions["1"].english;
    twiml.message(message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } else {
    let question = questions[smsCount.toString()]
    switch (question.type) {
      case "date":
        let dateTimeRegex = /^(3[0-1]|2[0-9]|1[0-9]|0?[1-9])-(1[0-2]|0?[1-9])\s(2[0-3]|1[0-9]|0?[0-9]):([0-5][0-9])$/;
        if (dateTimeRegex.exec(input) !== null) {
          let matches = dateTimeRegex.exec(input);
          let day = parseInt(matches[1]);
          let month = parseInt(matches[2]);
          let hour = parseInt(matches[3]);
          let minute = parseInt(matches[4]);
          let year = new Date().getFullYear();
          let newDate = new Date(year, month - 1, day, hour, minute);
          if (newDate.getMonth() === month - 1) {
            query.insertRecord(newDate)
              .then(result => {
                req.session.insertId = result.insertId;
                req.session.counter = smsCount + 1;
                message = questions[(smsCount + 1).toString()].english;
                twiml.message(message);
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
              })
              .catch(err => {
                winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
              });
          } else {
            message = errors.invalid_date.english;
            twiml.message(message);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          }
        } else {
          message = errors.invalid_date.english;
          twiml.message(message);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        }
        break;
      case "multiple":
        switch(isValidMultipleChoice(input, smsCount.toString())) {
          case 1:
            let answer = constructAnswer(input, question.options);
            let keyFields = query.createKeyFields(question.fields, [answer]);
            query.updateValues(keyFields, insertId)
              .then(() => {
                req.session.counter = smsCount + 1;
                message = questions[(smsCount + 1).toString()].english;
                twiml.message(message);
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
              })
              .catch(err => {
                winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
              });
            break;
          case 0:
            message = errors.invalid_multiple_choice.english;
            twiml.message(message);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
            break;
          case -1:
            message = errors.invalid_multiple_none_choice.english;
            twiml.message(message);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
            break;
        }
        break;
      case "single":
        if (isValidSingleChoice(input, smsCount.toString())) {
          let answer = constructAnswer(input, question.options);
          let keyFields = query.createKeyFields(question.fields, [answer]);
          query.updateValues(keyFields, insertId)
            .then(() => {
              if ("skip" in question) {
                if (question.skip.condition.toString() === answer) {
                  req.session.counter = question.skip.question;
                  message = questions[(question.skip.question).toString()].english;
                } else {
                  req.session.counter = smsCount + 1;
                  message = questions[(smsCount + 1).toString()].english;
                }
              } else {
                req.session.counter = smsCount + 1;
                message = questions[(smsCount + 1).toString()].english;
              }
              twiml.message(message);
              res.writeHead(200, {'Content-Type': 'text/xml'});
              res.end(twiml.toString());
            });
        } else {
          message = errors.invalid_single_choice.english;
          twiml.message(message);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        }
        break;
      case "location":
        let lat = req.body.Latitude;
        let lon = req.body.Longitude;
        if (lat != null && lon != null) {
          let keyFields = query.createKeyFields(questions[smsCount].fields, [lat, lon]);
          query.updateValues(keyFields, insertId)
            .then(() => {
              message = questions.end.english;
              req.session.destroy();
              twiml.message(message);
              res.writeHead(200, {'Content-Type': 'text/xml'});
              res.end(twiml.toString());
            })
            .catch(err => {
              winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
              throw err;
            });
        } else {
          message = errors.invalid_location.english;
          twiml.message(message);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        }
        break;
    }
  }
});

function isValidMultipleChoice(string, question) {
  if (string.length > 0) {
    for(let i = 0; i < string.length; i++) {
      if (!(string[i] in questions[question].options)) {
        return 0;
      }
      if (string.length > 1 && questions[question].none === string[i]) {
        return -1
      }
    }
    return 1;
  } else {
    return 0;
  }
}

function isValidSingleChoice(string, question) {
  return string.length === 1 && string in questions[question].options;
}

function constructAnswer(string, choices) {
  let answer = "";
  for (let i = 0; i < string.length; i++) {
    if (i === string.length - 1) {
      answer = answer.concat(choices[string[i]]);
    } else {
      answer = answer.concat(choices[string[i]] + ",");
    }
  }
  return answer
}

module.exports = router