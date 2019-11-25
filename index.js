const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const userRoute = require('./route/User_route');
const petRoute = require('./route/Pet_route');
const cmRoute = require('./route/Common_route');
const accRoute = require('./route/Account_route');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//remove request favicon.ico
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();

});
//use route
app.use('/user', userRoute);
app.use('/pet', petRoute);
app.use('/cm', cmRoute);
app.use('/acc', accRoute);
// app.use('/trans',transRoute);
app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});