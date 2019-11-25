var express = require('express')
var app = express()
var router = express.Router()

router.get('/user', function (req, res, next) {
    // if the user ID is 0, skip to the next router
    res.send('hello');
    console.log('ttttt');
    next();
    
});
app.use( function(req, res, next) {

    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
      return res.sendStatus(204);
    }
  
    return next();
  
  });
app.use('/', router);
app.listen(3000);