const express = require('express');
const accRoute = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');

accRoute.route('/getAccount').post(function (req, res) {
    var account = req.body.accName;
    var password = req.body.aPass;
    if (account) {
        let sql = `SELECT * FROM account WHERE accountName=? and password=? and acc_status=1`;

        let query = mysql.format(sql, [account,password]);

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

module.exports = accRoute;