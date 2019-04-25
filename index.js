const express = require('express');
const stories = require('./stories');

const app = express();
const PORT = 3000;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/stories', (req, res) => {
  res.json(stories);
});

/*app.get('/stories/:title', (req, res) => {
  const { title } = req.params;

  res.json(stories.filter(story => story.title.includes(title)));
});*/

app.get('/stories/:id', (req, res) => {
  const { id } = req.params;

  res.json(stories.filter(story => story.id == id));
});


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
