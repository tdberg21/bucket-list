const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Bucket List';
app.use(express.static('public'));

app.get('/', (request, response) => {
});

app.get('/api/v1/listitems', (request, response) => {
  database('listitems').select()
    .then((listitems) => {
      response.status(200).json(listitems);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/listitems', (request, response) => {
  const newItem = request.body;
  for (let requiredParameter of ['title', 'description']) {
    if (!newItem[requiredParameter]) {
      return response.status(422).send({error: `You are missing a required parameter: ${requiredParameter}`})
    }
  }

  database('listitems').insert(newItem, 'id')
    .then(item => {
      response.status(201).json({ id: item[0] })
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error })
    })
});

app.delete('/api/v1/listitems/:id', async (request, response) => {
  const id = request.params.id;
  const check = await database('listitems').where({ id })
  if (check.length) {
    database('listitems').where({ id })
      .del()
      .then(item => {
        response.status(200).json({ message: `Item with id:${id} successfully deleted` })
      })
      .catch(error => {
        response.status(500).json({ error })
      });
  } else {
    return response.status(404).send({ error: 'This id is invalid' })
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});

module.exports = app;