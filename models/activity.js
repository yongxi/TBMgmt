var dbServer = require("./db");
var Enrollment = require("./enrollment");

function Activity(activity) {
   if (activity) {
     this.id = activity.id;
     this.content = activity.content;
     this.place = activity.place;
     this.orginatorId = activity.orginatorId;
     this.createTime = activity.createTime;
     this.status = activity.status;
   }
}

module.exports = Activity;

var insertState = "INSERT INTO \"activity\"(\"user_id\", \"content\", \"place\", \"create_time\", \"status\") VALUES ($1, $2, $3, $4, $5);";

Activity.prototype.save = function save(callback) {
   dbServer.insert(insertState, [this.orginatorId, this.content, this.place, this.createTime, 0], callback);
};

var queryState = "SELECT id, user_id, \"content\", \"place\", create_time, \"status\" FROM \"activity\"";
Activity.prototype.getActivities = function get(callback) {
   dbServer.query(queryState, null, function(err, results) {
      console.log("Pansy says: " + err);
      console.log("Pansy says: " + results.rowCount);
	  debugger;
      if (results == null || results.length <= 0) {
         return callback(null);
      }
      return callback(Activity.convertActivityList(results));
   });
   return;
};

/*var queryOpeningState = "SELECT ac.id, ac.user_id, content, place, create_time, status FROM activity as ac WHERE ac.status = 0";
Activity.getOpeningActivities = function get(callback) {
   dbServer.query(queryOpeningState, null, function(err, results) {
      if (results == null || results.length <= 0) {
         return callback(null);
      }
      
      callback(results);
   });
};*/

var queryOpeningState = "SELECT ac.id, ac.user_id, content, place, create_time, status, en.user_id as attendee FROM activity as ac left join enrollment as en on ac.id = en.activity_id WHERE ac.status = 0";
Activity.getOpeningActivities = function get(callback) {
   dbServer.query(queryOpeningState, null, function(err, results) {
      if (results == null || results.length <= 0) {
         return callback(null);
      }
      
      callback(Activity.mergeActivities(results));
   });
};

   
var closeAcState = "UPDATE \"activity\" SET status = 1 WHERE id = $1;";

Activity.closeOneActivity = function (id, callback) {
   dbServer.query(closeAcState, [id], callback);
};

/*Activity.mergeActivitiesWithAttendee = function (activityList, enrollmentList) {
   var newList = new Array();
   if (activityList && activityList.length > 0) {
      for (var i = 0; i< activityList.length; i++) {
         var newActivity = Activity.convertActivity(activityList[i]);
         newActivity.attendees = Activity.getAttendees(newActivity.id, enrollmentList);
         newList.push(newActivity);
      }
   }
   return newList;
}*/

Activity.mergeActivities = function (activityList) {
   var newList = new Array();
   if (activityList && activityList.length > 0) {
      for (var i = 0; i< activityList.length; i++) {
         var attendeeId = activityList[i].attendee;
         var acId = activityList[i].id;
         var index = Activity.contains(newList, acId);
         if (index >= 0) {
            if (attendeeId) {
               if (newList[index].attendees.indexOf(attendeeId) == -1) {
                  newList[index].attendees.push(attendeeId);
                }
            }
         } else {
            var newActivity = Activity.convertActivity(activityList[i]);
            newList.push(newActivity);
         }
      }
   }
   return newList;
};

Activity.contains = function (activityList, acId) {
   if (activityList && activityList.length > 0) {
      for (var i = 0; i< activityList.length; i++) {
         if (activityList[i].id == acId) {
            return i;   
         }
      }
   }
   return -1;
};

// enrollmentList is list of object{activity_id, user_id}
Activity.getAttendees = function (activityId, enrollmentList) {
   var array = new Array();
   if (enrollmentList == null || enrollmentList.length == 0) {
      return array;   
   }
   
   for (var i = enrollmentList.length -1; i >= 0; i--) {
      if (enrollmentList[i].activity_id == activityId) {
         array.push(enrollmentList[i].user_id);
         enrollmentList.splice(i, 1);
      }
   }
   return array;
};

Activity.convertActivityList = function (acList) {
   var newList = new Array();
   if (acList && acList.length > 0) {
      for (var i = 0; i< acList.length; i++) {
         newList.push(Activity.convertActivity(acList[i]));
      }
   }
   return newList;
};

Activity.convertActivity = function (acFromDb) {
   var ac = new Activity();
   ac.id = acFromDb.id;
   ac.content = acFromDb.content;
   ac.place = acFromDb.place;
   ac.orginatorId = acFromDb.user_id;
   ac.createTime = acFromDb.create_time;
   ac.status = acFromDb.status;   
   ac.attendees = [];
   if (acFromDb.attendee) {
      ac.attendees.push(acFromDb.attendee);
   }
   
   return ac;
};



