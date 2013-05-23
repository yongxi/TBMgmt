var dbServer = require("./db");

function User(user) {
   if (user) {
      this.name = user.name;
      this.password = user.password;
      this.id = user.id;
      }
}

module.exports = User;


var insertState = "INSERT INTO \"user\"(id, \"name\", \"password\") VALUES ($1, $2, $3);";

User.prototype.save = function save(callback) {
   var newUser = this;
   dbServer.queryMaxId(function(maxId) {
      console.log("max id " + maxId);
      if (maxId >= 0) {
         dbServer.insert(insertState, [maxId + 1, newUser.name, newUser.password], callback);
      }
   });
};

var queryUsersState = "SELECT id, \"name\", \"password\" FROM \"user\" WHERE NAME = $1;";
User.prototype.get = function get(username, callback) {
   dbServer.query(queryUsersState, [username], function(err, users) {
      console.log("All users " + users.length);
      if (users == null || users.length <= 0) {
         return callback(null);
      }
      
      return callback(users[0]);
   });
   return null;
};

var queryAllUsersState = "SELECT id, \"name\" FROM \"user\";";
User.getAll = function get(callback) {
   dbServer.query(queryAllUsersState, null, function(err, users) {
      if (users == null || users.length <= 0) {
         return callback(null);
      }
      return callback(users);
   });
};
