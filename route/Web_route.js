const express = require('express');
const webRoute = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');


//get location
webRoute.route('/location').get(function (req, res) {
    let sql = `Select * FROM location ORDER BY locaName ASC`;
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

//update location by location_id
webRoute.route('/updateLocation').post(function (req, res) {
    var loca_id = req.body.loca_id;
    var loca_name = req.body.loca_name;
    var loca_stt = req.body.loca_stt;
    if (loca_id) {
        let sql = `UPDATE location SET locaName=?,loca_status=? WHERE locaID=?`;

        let query = mysql.format(sql, [loca_name,loca_stt,parseInt(loca_id)]);

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

//insert location
webRoute.route('/insertLocation').post(function (req, res) {
    var loca_name = req.body.lName;
 
    if (loca_name) {
        let sql = `INSERT INTO location(locaName) VALUES (?)`;

        let query = mysql.format(sql, [loca_name]);

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

//get account by account and password
webRoute.route('/getAccount').post(function (req, res) {
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

//get all moderator
webRoute.route('/getMod').get(function (req, res) {
    let sql = `Select accountName,acc_status, updated_time FROM account WHERE role='moderator'`;
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

//update status of Moderator
webRoute.route('/updateMod').post(function (req, res) {
    var accName  =req.body.accName;
    var stt = req.body.stt;
    if (accName) {
        let sql = `UPDATE account SET acc_status=? WHERE accountName=? and role='moderator' `;

        let query = mysql.format(sql, [parseInt(stt),accName]);

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

//insert new moderator
webRoute.route('/insertMod').post(function (req, res) {
    var accName  =req.body.accName;
    if (accName) {
        let sql = `INSERT INTO account(accountName,role) VALUES (?,'moderator') `;

        let query = mysql.format(sql, [accName]);

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

//change mod's password
webRoute.route('/changePass').post(function (req, res) {
    var account = req.body.accName;
    var password = req.body.aPass;
    if (account) {
        let sql = `UPDATE account SET password=? WHERE accountName=? and role='moderator' `;
        let query = mysql.format(sql, [password,account]);
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

//get all report_reason
webRoute.route('/getReason').get(function (req, res) {
    let sql = `Select * FROM report_reason`;
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

//insert new reason
webRoute.route('/insertReason').post(function (req, res) {
    var rsName  =req.body.rsName;
    if (rsName) {
        let sql = `INSERT INTO report_reason(reason) VALUES (?) `;

        let query = mysql.format(sql, [rsName]);

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

//update report reason
webRoute.route('/updateReason').post(function (req, res) {
    var rsID = req.body.rsID;
    var rsName  =req.body.rsName;
    var rsStt = req.body.rsStt;
    if (rsID) {
        let sql = `INSERT INTO report_reason(reason, status) VALUES (?,?) WHERE rpID=? `;

        let query = mysql.format(sql, [rsName,parseInt(rsStt),parseInt(rsID)]);

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

//get all breed
webRoute.route('/getBreed').get(function (req, res) {
    let sql = `Select * FROM pet_breed`;
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

//insert new breed
webRoute.route('/insertBreed').post(function (req, res) {
    var pbName  =req.body.pbName;
    var psID = req.body.psID;
    if (pbName) {
        let sql = `INSERT INTO pet_breed (ps_id,pb_name) VALUES(?,?)`;

        let query = mysql.format(sql, [parseInt(psID),pbName]);

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

//update breeed
webRoute.route('/updateBreed').post(function (req, res) {
    var pbID = req.body.pbID;
    var psID  =req.body.psID;
    var pbName = req.body.pbName;
    var pbStt = req.body.pbStt;
    if (pbID) {
        let sql = `UPDATE pet_breed SET ps_id=?, pb_name=?, pb_status=? WHERE pbID=?`;

        let query = mysql.format(sql, [parseInt(psID),pbName,parseInt(pbStt),parseInt(pbID)]);

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

//get all species
webRoute.route('/getSpecies').get(function (req, res) {
    let sql = `Select * FROM pet_species`;
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

//insert new species
webRoute.route('/insertSpecies').post(function (req, res) {
    var psName  =req.body.psName;
    if (psName) {
        let sql = `INSERT INTO pet_species (ps_name) VALUES(?)`;

        let query = mysql.format(sql, [psName]);

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

//update species
webRoute.route('/updateSpecies').post(function (req, res) {
    var psID = req.body.psID;
    var psName  =req.body.psName;
    var psStt = req.body.psStt;
    if (psID) {
        let sql = `UPDATE pet_species SET ps_name=?, ps_status=? WHERE psID=?`;

        let query = mysql.format(sql, [psName,parseInt(psStt),parseInt(psID)]);

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

module.exports = webRoute;