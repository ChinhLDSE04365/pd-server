const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const cors = require('cors');

const userRoute = require('./route/User_route');
const petRoute = require('./route/Pet_route');
const cmRoute = require('./route/Common_route');
const webRoute = require('./route/Web_route');
const postRoute = require('./route/Post_route');
const chatRoute = require('./route/Chat_route');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//use route
app.use('/user', userRoute);
app.use('/pet', petRoute);
app.use('/cm', cmRoute);
app.use('/post', postRoute);
app.use('/web', webRoute);
app.use('/chat', chatRoute);

// app.use('/trans',transRoute);
app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});