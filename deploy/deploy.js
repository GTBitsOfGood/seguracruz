
console.log("Deploying to prod...")
const {v4: uuidv4} = require('uuid');
const ghpages = require('gh-pages');
ghpages.publish('../app', {
  src: ['./*.js', './*.json', './res/**', './routes/**', './build/**'],
  message: 'Deployed Boliviabot: ' + uuidv4(),
  branch: 'prod',
  repo: 'https://github.gatech.edu/mkoohang6/boliviabot.git'
}, function(err) {
  console.log(err);
});