const express = require('express');
require('express-async-errors');
require('dotenv').config();

const dogsRouter = require('./routes/dogs');

const app = express();

app.use(express.json());
app.use('/static', express.static('assets'));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(res.statusCode);
  });

  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/dogs', dogsRouter);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  const error = new Error(`The requested resource couldn't be found.`);
  error.statusCode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(`${err.statusCode} ${err.message}`);
  const statusCode = err.statusCode || 500;

  let errorObj = {
    message: err.message || `Something went wrong`,
    statusCode,
  }
  if(process.env.NODE_ENV === 'development') {
    errorObj.stack = err.stack
  }

  res.status(statusCode).json(errorObj);
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server is listening on port', port));
