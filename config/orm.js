// Import MySQL connection.
var connection = require("./connection.js");

var orm = {
    updateOne: function(table, changeColumn, newValue, idColumn, id, cb) {
       
        var queryString = "UPDATE ?? SET ?? = ? WHERE ?? = ?;";
        connection.query(queryString, [table, changeColumn, newValue, idColumn, id], function(err, data){
            if (err) {
                console.log(err);
            }
            cb(data);
        });
    },
    selectAll: function(table, cb) {
        var queryString = "SELECT * FROM ??;";
        connection.query(queryString, [table], function(err, data){
            if (err) {
                console.log("orm.js, selectAll error: " + err);
            }
            cb(data);
        });
    },
    insertOne: function(table, column, value, cb) {
       
        var queryString = "INSERT INTO ?? (??) VALUES (?);"
        connection.query(queryString, [table, column, value], function(err, data){
            if (err) {
                console.log("orm.js, insertOne error: " + err);
            }
            cb(data);
        });
    }
    
};

module.exports = orm;