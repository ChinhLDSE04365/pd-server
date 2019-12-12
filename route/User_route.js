const express = require('express');
const userRoutes = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');



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

//get user by uid
userRoutes.route('/users/:uid').get(function (req, res) {
  var uid = req.params.uid;

  if (uid) {
    let sql = `Select user.*, location.locaName FROM user
    INNER JOIN location ON user.user_location=location.locaID
    where user.uID= ?`;

    let query = mysql.format(sql, [parseInt(uid)]);

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

    let query = mysql.format(sql, [data, parseInt(uid)]);
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

//check followed
userRoutes.route('/checkFollow').get(function (req, res) {
  var myid = req.query.myid;
  var urid = req.query.urid;
  if (myid && urid) {
    let sql = `SELECT * FROM followed WHERE follower_id=? and followed_id=?`;

    let query = mysql.format(sql, [parseInt(myid), parseInt(urid)]);
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

userRoutes.route('/userFollow').post(function (req, res) {
  var data = req.body;
  if (data) {
    let sql = `INSERT INTO followed SET ? `;

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
userRoutes.route('/userFollow').delete(function (req, res) {
  var myid = req.body.myid;
  var urid = req.body.urid;
  if (myid && urid) {
    let sql = `DELETE FROM followed WHERE  follower_id=? and followed_id=?`;

    let query = mysql.format(sql, [parseInt(myid), parseInt(urid)]);
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

//select limit images that uploaded by the user
userRoutes.route('/images/:uid').get(function (req, res) {
  var uid = req.params.uid;
  if (uid) {
    let sql = `SELECT * FROM multimedia_storage WHERE user_id=? ORDER BY uploaded_at DESC LIMIT 4`;

    let query = mysql.format(sql, [parseInt(uid)]);

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
//select all images that uploaded by the user
userRoutes.route('/imagesAll/:uid').get(function (req, res) {
  let limit = 15;
  var uid = req.params.uid;
  var page = req.query.page;
  var offset = (page - 1) * limit;
  if (uid) {
    let sql = `SELECT * FROM multimedia_storage WHERE user_id=? ORDER BY uploaded_at DESC
              LIMIT ?,?`;

    let query = mysql.format(sql, [parseInt(uid),offset, limit]);
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

//search user_name by keyword
userRoutes.route('/search').get(function (req, res) {
  var kw = req.query.keyword;
  var ownid = req.query.ownid;
  let sql = `SELECT user.*, COUNT(fo.follower_id) as NOF FROM user 
    LEFT JOIN followed as fo ON user.uID = fo.followed_id
    WHERE MATCH (user.user_name) AGAINST (? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AND user.uID!= ?
    GROUP BY user.uID
    ORDER BY NOF DESC`;

  let query = mysql.format(sql, [kw, parseInt(ownid)]);
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

});


module.exports = userRoutes;