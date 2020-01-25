const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require('./apiRouter');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));

app.use('/api', apiRouter);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`));
