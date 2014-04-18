var email   = require("emailjs");
var EM = {};
var server;
/*
email = {
   text:    "i hope this works", 
   from:    "you <username@gmail.com>", 
   to:      "someone <someone@gmail.com>, another <another@gmail.com>",
   cc:      "else <else@gmail.com>",
   subject: "testing emailjs"
}
*/
EM.connect = function(s) {
	console.log("MI CONNETTO A GOOGLE");
	server = email.server.connect(s);
	console.log(server);
}
EM.sendMail = function(s, e, callback) {
	/*
	var server  = email.server.connect({
								user:    "g.delgobbo@flyer.it", 
								password:"22724gia", 
								host:    "smtp.gmail.com", 
								ssl:     true
								
							});
	*/
	if (typeof(server)=="undefined") {
		this.connect(s);
		console.log("mi connetto");
	}
	server.send(e, function(err, message) {
		console.log(err || message);
		callback(err, message);
	});
}
module.exports = EM;
