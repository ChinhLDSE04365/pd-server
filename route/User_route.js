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

//update User_Avatar
userRoutes.route('/updateUAvatar').post(function (req, res) {
  var uid = req.body.uid;
  var uAvatar = req.body.uAvatar;
  if (uid) {
    let sql = `UPDATE user SET user_avatar=? WHERE uID=?`;

    let query = mysql.format(sql, [uAvatar,parseInt(uid)]);
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

//Insert new user
userRoutes.route('/insertUser').post(function (req, res) {
  var uEmail = req.body.uEmail;
  var uLoca  = req.body.uLoca;
  var uName = req.body.uName;
  var uAvatar = req.body.uAvatar;
  var uGender = req.body.uGen;
  if (uEmail) {
    let sql = `INSERT INTO user (user_email, user_location, user_name, user_avatar, user_gender) VALUES (?,?,?,?,?)`;

    let query = mysql.format(sql, [uEmail,parseInt(uLoca),uName,uAvatar,uGender]);
    
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
//Update user profile
userRoutes.route('/updateUser').post(function (req, res) {
  var uID = req.body.uID;
  var uLoca  = req.body.uLoca;
  var uName = req.body.uName;
  var uGender = req.body.uGen;
  var uAddress = req.body.uAdr;
  var uDOB = req.body.uDOB;
  var uPhone = req.body.uPhone;
  var uPrivacy = req.body.uPri;
  if (uID) {
    let sql = `UPDATE user SET user_location=?, user_name=?, user_gender=?, user_phone=?, user_dob=?, user_address=?, privacy=? 
              WHERE uID = ?`;

    let query = mysql.format(sql, [parseInt(uLoca),uName,uGender,uPhone,uDOB,uAddress,uPrivacy, parseInt(uID)]);

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