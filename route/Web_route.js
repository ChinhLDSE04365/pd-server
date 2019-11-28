const express = require('express');
const webRoute = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');


//get location
webRoute.route('/locations').get(function (req, res) {
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

//get location by location_id
webRoute.route('/locations/:locaID').get(function (req, res) {
    var loca_id = req.params.locaID;
    if (loca_id) {
        let sql = `Select * FROM location WHERE locaID=?`;
        let query = mysql.format(sql, [parseInt(loca_id)]);
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

//update location by location_id
webRoute.route('/locations/:locaID').put(function (req, res) {
    var loca_id = req.params.locaID;
    let data = req.body;
    if (loca_id) {
        // let sql = `UPDATE location SET locaName=?,loca_status=? WHERE locaID=?`;
        let sql = `UPDATE location SET ? WHERE locaID=?`;
        // let query = mysql.format(sql, [loca_name,loca_stt,parseInt(loca_id)]);
        let query = mysql.format(sql, [data, parseInt(loca_id)]);
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
webRoute.route('/locations').post(function (req, res) {
    var data = req.body;
    if (data) {
        let sql = `INSERT INTO location SET ?`
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

//get account by account and password
webRoute.route('/account').post(function (req, res) {
    var account = req.body.accName;
    var password = req.body.aPass;
    if (account) {
        let sql = `SELECT * FROM account WHERE accountName=? and password=? and acc_status=1`;
        let query = mysql.format(sql, [account, password]);
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
webRoute.route('/mods').get(function (req, res) {
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

//get mod by accountName
webRoute.route('/mods/:accName').get(function (req, res) {
    var accName = req.params.accName;
    if (accName) {
        let sql = `Select accountName,acc_status, updated_time FROM account WHERE accountName=? and role='moderator' `;

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
//update Moderator
webRoute.route('/mods/:accName').put(function (req, res) {
    var accName = req.params.accName;
   var data = req.body;
    if (accName) {
        let sql = `UPDATE account SET ? WHERE accountName=? and role='moderator' `;

        let query = mysql.format(sql, [data, accName]);

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
webRoute.route('/mods').post(function (req, res) {
    var accName = req.body.accName;
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
webRoute.route('/changePass/:accName').put(function (req, res) {
    var account = req.params.accName;
    var password = req.body.pass;
    if (account) {
        let sql = `UPDATE account SET password=? WHERE accountName=? and role='moderator' `;
        let query = mysql.format(sql, [password, account]);
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
webRoute.route('/reasons').get(function (req, res) {
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

//get report reason by rsID
webRoute.route('/reasons/:rsID').get(function (req, res) {
    var rsID = req.params.rsID;
    if (rsID) {
        let sql = `SELECT * FROM report_reason WHERE rpID=? `;

        let query = mysql.format(sql, [parseInt(rsID)]);

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

//insert new reason
webRoute.route('/reasons').post(function (req, res) {
    var data = req.body;
    if (data) {
        let sql = `INSERT INTO report_reason SET ? `;

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

//update report reason
webRoute.route('/reasons/:rsID').put(function (req, res) {
    var rsID = req.params.rsID;
    var data = req.body;
    if (rsID) {
        let sql = `UPDATE report_reason SET ? WHERE rpID=? `;

        let query = mysql.format(sql, [data, parseInt(rsID)]);

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
webRoute.route('/breeds').get(function (req, res) {
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

//get breeed by pbID
webRoute.route('/breeds/:pbID').get(function (req, res) {
    var pbID = req.params.pbID;
    if (pbID) {
        let sql = `SELECT * FROM pet_breed WHERE pbID=?`;

        let query = mysql.format(sql, [parseInt(pbID)]);

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

//insert new breed
webRoute.route('/breeds').post(function (req, res) {

    var data = req.body;
    if (data) {
        let sql = `INSERT INTO pet_breed SET ?`;

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

//update breeed
webRoute.route('/breeds/:pbID').put(function (req, res) {
    var pbID = req.params.pbID;
    var data = req.body
    if (pbID) {
        let sql = `UPDATE pet_breed SET ? WHERE pbID=?`;

        let query = mysql.format(sql, [data, parseInt(pbID)]);

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
webRoute.route('/species').get(function (req, res) {
    let sql = `SELECT * FROM pet_species`;
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

//get species by psID
webRoute.route('/species/:psID').get(function (req, res) {
    var psID = req.params.psID;
    if (psID) {
        let sql = `SELECT * FROM pet_species WHERE psID=?`;

        let query = mysql.format(sql, [parseInt(psID)]);

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

//insert new species
webRoute.route('/species').post(function (req, res) {
    var data = req.body;

    if (data) {
        let sql = `INSERT INTO pet_species SET ?`;

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

//update species
webRoute.route('/species/:psID').put(function (req, res) {
    var psID = req.params.psID;
    var data = req.body;
    if (psID) {
        let sql = `UPDATE pet_species SET ? WHERE psID=?`;

        let query = mysql.format(sql, [data, parseInt(psID)]);

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