var dbServer = require("./db");
function Enrollment() {
	
}

module.exports = Enrollment;

var enrollActiviryState = "INSERT INTO \"enrollment\"(\"user_id\", \"activity_id\") VALUES ($1, $2);";
Enrollment.joinOneUser = function joinOneUser(userId, activityId, callback) {
	dbServer.insert(enrollActiviryState, [userId, activityId], callback);
};

var quitActiviryState = "DELETE FROM \"enrollment\" WHERE \"user_id\" = $1 AND \"activity_id\" =  $2;";
Enrollment.quitOneActivity = function (userId, activityId, callback) {
	dbServer.query(quitActiviryState, [userId, activityId], callback);
};

var queryEnrollmentState = "SELECT user_id, activity_id FROM \"enrollment\"";
Enrollment.queryAllEnrollment = function (callback) {
	dbServer.query(queryEnrollmentState, null, callback);
};