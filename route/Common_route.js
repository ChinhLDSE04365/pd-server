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



module.exports = cmRoute;