var pg = require('pg'); //native libpq bindings = `var pg = require('pg').native`
var conString = "tcp://postgres:postgres@localhost:5432/teambuilding";

var client = new pg.Client(conString);
client.connect();

module.exports.query = function(queryString, values, callback) {
   pg.connect(conString, 
      function(error, client, done) {
         client.query(queryString, values, function(err, result){
            callback(err, result ? result.rows : null);
            done();
         });
       }
   );
};

module.exports.queryAll = function(queryString, callback) {
   pg.connect(conString, 
      function(error, client, done) {
         client.query(queryString, function(err, result){
            callback(err, result ? result.rows : null);
            done();
         });
       }
    );
};

module.exports.queryMaxId = function(callback) {
   var tableName = "user";
   if (arguments.length == 2) {
      tableName = arguments[0];
      callback = arguments[1];
   }
   
   connectDbServer();
   var state = "SELECT MAX(id) AS id FROM \""+ tableName +"\"";
   var query = client.query(state, function(err, result) {
      client.end();
      if (err) {
         return callback(-1);
      }
      debugger;
      if (result.rowCount <= 1) {
          callback(0);
      }
      else
         callback(parseInt(result.rows[0].id));
   });
};

module.exports.insert = function(statement, values, callback) {
   pg.connect(conString, 
      function(error, client, done) {
         client.query(statement, values, function(error, result){
            callback(error);
            done();
         });
       }
    );
};

function connectDbServer() {
   client = new pg.Client(conString);
   client.connect();
}
