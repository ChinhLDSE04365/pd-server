const express = require("express");
const chatRoute = express.Router();
const createConnection = require("../MySQLConnection");
const mysql = require("mysql");

//select conversation where two 
chatRoute.route("/getCountConversation").get(function (request, response) {
  //current logged user ID
  let userOneID = request.query.userOneID;
  //the other user ID that current user ID make conversation with
  let userTwoID = request.query.userTwoID;

  if (userOneID && userTwoID) {

    let sql = `SELECT * FROM conversation 
  WHERE (userOne = ? AND userTwo = ?) OR (userOne = ? AND userTwo = ?) LIMIT 1`;
    let query = mysql.format(sql, [userOneID, userTwoID, userTwoID, userOneID]);
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return response.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});


//get list of conversation that current user take part in
chatRoute.route("/getConversationList/:uid").get(function (request, response) {
  let currentUserID = request.params.uid;
  let integerUserID = parseInt(currentUserID);
  //console.log(currentUserID)

  if (integerUserID) {

    let sql = `SELECT * FROM 
  (SELECT con1.*, user.uID, user.user_name, user.user_avatar FROM conversation AS con1 
  JOIN user ON con1.userTwo = user.uID
  WHERE userOne = ?
  UNION
  SELECT con2.*, user.uID, user.user_name, user.user_avatar FROM conversation AS con2 
  JOIN user ON con2.userOne = user.uID
  WHERE userTwo = ?) 
  AS list
  WHERE updated_at IS NOT NULL 
  ORDER BY updated_at DESC`;
    let query = mysql.format(sql, [
      integerUserID,
      integerUserID,
    ]);
    // console.log(query);
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          throw error;
        }
        if (results.length == 0) {
          return response
            .status(404)
            .send("Khong tim thay cuoc hoi thoai nao !!!!!");
        }

        return response.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//update time last message sent in this conversation
chatRoute.route("/updateConversationTime").put(function (request, response) {
  let conversationID = request.query.cid;
  let integerConversationID = parseInt(conversationID);

  if (integerConversationID) {
    let sql = `UPDATE conversation SET updated_at = CURRENT_TIMESTAMP WHERE conID = ?`;

    let query = mysql.format(sql, [integerConversationID]);
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return response.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//Insert new conversation
chatRoute.route("/createConversation").post(function (request, response) {
  let data = request.body;
  if (data) {
    let sql = `INSERT INTO conversation SET ?`;

    let query = mysql.format(sql, [data]);
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return response.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

module.exports = chatRoute;
