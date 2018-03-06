const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const winston = require('winston');

const app = express();

/* Getting all the db querys */
const { saveUser } = require('./models/user');
/* This middle ware checks if the token given by the user is right */
const { authenticate } = require('./middleware/authenticate');

// The code below allows the node js to find the public directory with the index.html file
const publicPath = path.join(__dirname, './public');
// Node js is using port 3000/ and when you push to cloud it will use process.env.PORT
const port = process.env.PORT || 3000;

// Bodyparser for using json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));


/* GET index page */
app.get('/', (req, res) => {
  res.render('index');
});

/* This function saves a user to the db
  It uses promises.
 */
app.post('/createUser', (req, res) => {
  saveUser(req.body)
    .then(result => res.header('x-auth', result.token).send({ email: result.email }))
    .catch(e => res.status(400).send(e));
});

/* When the user from the front-end wants to use a function,
  The below code is an example of using the word authenticate to see if the
  user is actually authenticated
*/
app.get('/get/me', authenticate, (req, res) => {
  res.send(req.user);
});

const server = app.listen(port, () => {
  winston.log('info', `Server is up on ${port}`);
});

module.exports = server;
