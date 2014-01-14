var User = require("../models/user");
var Activity = require("../models/activity");
var Enrollment = require("../models/enrollment");
var Mail = require("../models/mail");
/*
 * GET home page.
 */
exports.refreshHome = function (req, res) {
   res.render("home", {title: "Hello"});
}

exports.login = function(req, res) {
   res.render("login", {title: "Login"});
};

exports.doLogin = function(req, res) {
   var currentUser = new User({
      name: req.body["username"],
      password: req.body["password"]
   });
   
   clearSession(req);
   
   currentUser.get(currentUser.name, function(existedUser) {
      console.log("User existed: " + (existedUser));
      if (existedUser) {
         if (existedUser.password == currentUser.password) {
            req.session.user = new User(existedUser);
            return res.redirect("/");
         }
         req.session.error = "Password is wrong.";
      } else {
         req.session.error = "The user doesn't find.";
      }
      return res.redirect("/login");
   });
   
};

exports.logout = function(req, res) {
    req.session.error = "";
    req.session.user = null;
    res.redirect("/login");
};

exports.register = function(req, res) {
   res.render("register", {title: "Register"});
};

//TODO: check user name is existed
exports.doRegister = function(req, res) {
   clearSession(req);
   if (req.body["password"] != req.body["password-repeat"]) {
      req.session.error = "Passwords are different.";
      return res.redirect("/register");
   }
   var newUser = new User({
      name: req.body["username"],
      password: req.body["password"]
   });
   
   newUser.save(function (error) {
      if (error != null) {
         console.log("register error " + error);
         req.session.error = error.message;
         return res.redirect("/register");
      } 
      req.session.username = req.body["username"];
      return res.redirect("/login?username="+ req.body["username"]);
   });
};

exports.index = function(req, res) {
   /*var acCompleted = false;
   var enCompleted = false;
   var acList = null;
   var enList = null;
   console.log("enter index");
   Activity.getOpeningActivities(
      function(activityList) {
         acCompleted = true;
         acList = activityList;
         console.log("ac completed");
         if (enCompleted == true) {
            var newAcList = Activity.mergeActivitiesWithAttendee(acList, enList);
            return res.render("index", {title: "Home", activityList: newAcList});
         }
          
       }// End activity callback
   );
   Enrollment.queryAllEnrollment(
      function (error, enrollmentList) {
         enCompleted = true;
         enList = enrollmentList;
         console.log("en completed");
         if (acCompleted == true) {
            var newAcList = Activity.mergeActivitiesWithAttendee(acList, enList);
            return res.render("index", {title: "Home", activityList: newAcList});
         }
      }
   ); */

   Activity.getOpeningActivities(
      function(activityList) {
         User.getAll(
            function (userList) {
               var usersMap = new Object();
               if (userList) {
                  userList.forEach(
                     function (user) {
                        usersMap[user.id] = user.name;
                     }
                  );
               }
               
               return res.render("index", {title: "Home", activityList: activityList, usersMap: usersMap});
            }
         );
       }// End activity callback
   );
};

exports.getActivityList = function(req, res) {
   debugger;
   new Activity().getActivities(
      function(activityList) {
         res.render("activities", {title: "Activites List", activityList: activityList});
      }
   );
};

exports.launchActivity = function(req, res) {
   debugger;
   var newActivity = new Activity({
      content: req.body['content'],
      place:req.body['place'],
      orginatorId: req.session.user.id,
      createTime: convertDateTimeFromClient(req.body['beginDate'], req.body['beginTime']),
   });
   newActivity.save(function (error) {
        req.session.error = "";
        if (error) {
           req.session.error = error.message;
        } else if (req.body['mailTo'] != undefined) {
           var launcher = req.session.user.name;
           Mail.sendMail(launcher, req.body['mailTo'], 
           Mail.launchAcSubject(launcher, req.body['content']),
           Mail.luanchAcContent(launcher, req.body['content']),
            function (error, response) {
               return res.redirect("/activity");
            });
           return;
        }
        
        return res.redirect("/activity");
     });
   
  
};

exports.checkActivityNotEnrolled = function (req, res, next) {
   next();
};

exports.checkActivityEnrolled = function (req, res, next) {
   next();
};

exports.checkIsActivityOwner = function (req, res, next) {
   next();
};

exports.quitOneActivity = function (req, res, next) {
   Enrollment.quitOneActivity(req.session.user.id, req.body['activityId'],
   function(error) {
       req.session.error = "";
       if (error) {
         req.session.error = error.message;
       }
       return res.redirect("/");
      }
   );
};

exports.enrollOneActivity = function (req, res, next) {
   console.log(req.session.user.id + 'current user');
   Enrollment.joinOneUser(req.session.user.id, req.body['activityId'],
      function(error) {
          req.session.error = "";
          if (error) {
            req.session.error = error.message;
          }
          return res.redirect("/");
         }
      );
};

exports.closeAnActivity = function (req, res, next) {
   console.log("close " + req.body['activityId']);
   Activity.closeOneActivity(req.body["activityId"], function (error, result) {
      console.log("close back");
      return res.redirect("/");
   });
};

exports.checkLogin = function (req, res, next) {
   if (!req.session.user) {
      console.log("not login in");
      return res.redirect("/login");
   }
   next();
};

exports.checkNotLogin = function (req, res, next) {
   if (req.session.user) {
      return res.redirect("/");
   }
   next();
};

function clearSession(req) {
   req.session.error = "";
    req.session.user = null;
}

function convertDateTimeFromClient(dateStr, timeStr) {
   if (dateStr == undefined) {
      return new Date();
   }
   
   var formattedTime = "00:00:00";
   if (timeStr) {
      var convention = timeStr.slice(timeStr.length-2);
      var timeArray = timeStr.split(":");
      var hour = parseInt(timeArray[0]);
      if (convention == "pm") {
        hour = hour + 12;  
      }
      var minute = parseInt(timeArray[1]);
      
      formattedTime = hour + ":" + minute;
   } 
   
   return new Date(dateStr + " " + formattedTime);
}

