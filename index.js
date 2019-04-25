const express = require('express');
const request = require('request');
const stories = require('./stories');

const app = express();
const PORT = 3000;
const TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';

app.use((req, res, next) => {
  console.log('Request: ', req.method, req.url, req.headers);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

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

app.get('/topstories', (req, res) => {
  request({ url: TOP_STORIES_URL },
   (error, response, body) => {
    res.json(JSON.parse(body));
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
