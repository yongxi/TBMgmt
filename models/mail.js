var nodemailer = require("nodemailer");
function Mail() {
}

module.exports = Mail;
Mail.sendMail = function (from, to, subject, html, callback) {
   console.log("enter mail");
   var smtpTransport = nodemailer.createTransport("SMTP", {
      service:"Gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
         user:"auroraui2013@gmail.com",
         pass:"aurora2013"
      }
   });
   debugger;
   console.log("mail from " + to + (smtpTransport != null));
   var mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html
   };
   debugger;
   smtpTransport.sendMail(mailOptions, function (err, response){
      debugger;
      console.log("send maik back");
      if (err) {
         conlose.log("Send mail failes " + err);
      } else {
         console.log("send mail successes " + response.message);
      }
      return callback(err, callback);
   });
   debugger;
   smtpTransport.close();
};

Mail.launchAcSubject = function (launcher, acName) {
   return launcher + " invites you to take part in the activity " + acName;
}

Mail.luanchAcContent = function (launcher, acName) {
   return "test" + acName;
}

