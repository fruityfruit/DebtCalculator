const express = require('express');
const path = require('path');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

// Test
router.get('/dlandrum', (req, res) => {
  res.send('dlandrum test');
});

// Catch all other routes and return the index file
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/mean-app/index.html'));
});

module.exports = router;
