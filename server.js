const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Bucket List';
app.use(express.static('public'));

app.get('/', (request, response) => {

});

app.get('/api/v1/bucketlist', (request, response) => {
  const { title, description } = request.body;

  response.json({ title, description });
});

app.listen(3000, () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});