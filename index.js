const express = require('express');
const request = require('request');
const path = require('path');
const stories = require('./stories');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const TOP_STORIES_URL = `${BASE_URL}/topstories.json`;
const LIMIT = 10;

app.use((req, res, next) => {
  console.log('Request: ', req.method, req.url, req.headers);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(path.join(__dirname, "client/dist")));

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

app.get('/topstories', (req, res, next) => {
  request({url: TOP_STORIES_URL},
    (error, response, body) => {
      if (error || response.statusCode !== 200 || !response.headers['content-type'].includes('application/json')){
        return next(new Error('Error requesting top stories!'));
      }

      const topStories = JSON.parse(body);

      Promise.all(
        topStories.slice(0, LIMIT).map(story => {
          return new Promise((resolve, reject) => {
            request( {url: `${BASE_URL}/item/${story}.json`},
              (error, response, body) => {
                if (error || response.statusCode !== 200 || !response.headers['content-type'].includes('application/json')){
                  return reject(new Error('Error requesting story item!'));
                }

                resolve(JSON.parse(body));
              });
          })
        })
      )
      .then(fullTopStories => {
        res.json(fullTopStories);
      })
      .catch(error => next(error));
    });
});

app.use((err, req, res, next) => {
  console.log('err', err);
  res.status(500).json({type: 'error', message: err.message});
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
