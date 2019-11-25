var mysql = require('mysql');

//setting db server
var pool = mysql.createPool({
    connectionLimit: 30,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'petdating',
    multipleStatements: true
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
        console.log("Success connection to server"); 
    });
};

module.exports = getConnection;