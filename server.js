const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Bucket List';
app.use(express.static('public'));

app.get('/', (request, response) => {

});

app.get('/api/v1/bucketlist', (request, response) => {
  database('listitems').select()
    .then((listitems) => {
      response.status(200).json(listitems);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(3000, () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});