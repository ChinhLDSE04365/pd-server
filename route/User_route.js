const express = require('express');
const userRoutes = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');


//get User by uID
userRoutes.route('/getUserByID').get(function (req, res) {
  var id = req.query.id;
  if (id) {
    let sql = "Select * FROM user where uID=  ?";
    let query = mysql.format(sql, parseInt(id));

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//get User by email
userRoutes.route('/getUserByEmail').get(function (req, res) {
  var email = req.query.em;
  if (email) {
    let sql = `Select user.*, location.locaName FROM user
    INNER JOIN location ON user.user_location=location.locaID
    where user.user_email= ?`;
    let query = mysql.format(sql, email);

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error || results.length == 0) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});


//get follower by userID
userRoutes.route('/getFollowerByID').get(function (req, res) {
  var uid = req.query.uid;
  if (uid) {
    let sql = `SELECT count(followed_id) as follower FROM followed WHERE follower_id=?
    GROUP BY follower_id `;

    let query = mysql.format(sql, parseInt(uid));

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//get followed by userID
userRoutes.route('/getFollowedByID').get(function (req, res) {
  var uid = req.query.uid;
  if (uid) {
    let sql = `SELECT count(follower_id) as followed FROM followed WHERE followed_id=?
              GROUP BY followed_id`;

    let query = mysql.format(sql, parseInt(uid));

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});


//Insert new user
userRoutes.route('/users').post(function (req, res) {
  var data = req.body;

  if (data) {
    let sql = `INSERT INTO user SET ?`;

    let query = mysql.format(sql, [data]);
    
    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//update user by UID
userRoutes.route('/users/:uid').put(function (req, res) {
  var uid = req.params.uid;
  var data = req.body;
  if (uid) {
    let sql = `UPDATE user SET ? WHERE uID=?`;

    let query = mysql.format(sql, [data,parseInt(uid)]);
    console.log(query);
    
    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});


module.exports = userRoutes;