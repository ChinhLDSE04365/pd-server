const express = require('express');
const cmRoute = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');


//get all location from db
//location
cmRoute.route('/location').get(function (req, res) {
    let sql = "Select locaID,locaName FROM location WHERE loca_status=1 ORDER BY locaName ASC";
    //thực hiện câu lệnh query
    createConnection(function (err, connection) {
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if (error) {
                return res.status(404).send("404-Not Found");
            }
            return res.status(200).json(results);
        });
    });

});
//get list location for RNPickerSelect
cmRoute.route('/location2').get(function (req, res) {
    let sql = "Select locaName as label ,locaID as value FROM location WHERE loca_status=1 ORDER BY locaName ASC";
    //thực hiện câu lệnh query
    createConnection(function (err, connection) {
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if (error) {
                return res.status(404).send("404-Not Found");
            }
            return res.status(200).json(results);
        });
    });

});
//get location by locaID
//locaBylocaID?locaid=
cmRoute.route('/locaBylocaID').get(function (req, res) {
    let locaID = req.query.locaid;
    if (locaID) {
        let sql = "SELECT * FROM location WHERE locaID= ?";
        let query = mysql.format(sql, [parseInt(locaID)]);
        createConnection(function (err, connection) {
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

//get breeds by species
cmRoute.route('/breedBySP').get(function (req, res) {
    let spID = req.query.spid;
    if (spID) {
        let sql = "SELECT pbID, pb_name FROM pet_breed WHERE ps_id= ? and pb_status=1";
        let query = mysql.format(sql, [parseInt(spID)]);
        createConnection(function (err, connection) {
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

//insert new img
cmRoute.route('/multimedia').post(function (req, res) {
    var data =req.body;
    if (data) {
      let sql = `INSERT INTO multimedia_storage SET ?`;
      let query = mysql.format(sql, [data]);
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
  //get list report_reason for RNPickerSelect
  cmRoute.route('/rpreason').get(function (req, res) {
    let sql = "Select reason as label ,rpID as value FROM report_reason WHERE status=1 ORDER BY rpID ASC";
    //thực hiện câu lệnh query
    createConnection(function (err, connection) {
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if (error) {
                return res.status(404).send("404-Not Found");
            }
            return res.status(200).json(results);
        });
    });

});
module.exports = cmRoute;