var CT = require('../modules/country-list');
var GoogleSpreadsheet = require("google-spreadsheet");
var EM = require('../modules/email-dispatcher');
var emails = {Samuele:'s.huynhhong@liveperformersmeeting.net', Gianluca:'g.delgobbo@liveperformersmeeting.net', Chiara:'c.gianniniguazzugli@liveperformersmeeting.net', Fax:'a.familari@liveperformersmeeting.net', Carlotta:'c.piccinini@liveperformersmeeting.net'}
var passwords = {Samuele:'s.huynhhong@liveperformersmeeting.net', Gianluca:'22724gia', Chiara:'c.gianniniguazzugli@liveperformersmeeting.net', Fax:'a.familari@liveperformersmeeting.net', Carlotta:'c.piccinini@liveperformersmeeting.net'}
var signature = "\n______________________________________\nLPM - Live Performers Meeting\nliveperformersmeeting.net\nVia del Verano 39 - 00185 Rome\nTel. +39 06 78147301 Fax +39 06 78390805"


exports.get = function get(req, res) {
    res.render('spreadsheet', { locals: {title:"Partners Manager", countries : CT},post:[],results:[],failed:[[],[]], success:[[],[]] });
};
exports.post = function get(req, res) {
	// console.log(res);
	// without auth -- read only
	// # is worksheet id - IDs start at 1
	// console.log( req.body);
	if (req.body.spreadsheet_key && req.body.email && req.body.password) {
		var my_sheet = new GoogleSpreadsheet(req.body.spreadsheet_key);

		// set auth to be able to edit/add/delete
		my_sheet.setAuth(req.body.email,req.body.password, function(err){
		    my_sheet.getInfo( function( err, sheet_info ){
		        console.log( sheet_info.title + ' is loaded' );
		        // use worksheet object if you want to forget about ids
		        sheet_info.worksheets[0].getRows( function( err, rows ){
				    console.log( err);
				    console.log( rows);
			    	var to = [];
			    	var exclude = req.body.exclude.toLowerCase().split(",");
					for(var a=0;a<rows.length;a++){
						if (((req.body.status && rows[a].status == req.body.status) || !req.body.status) && rows[a].person=="Gianluca" && exclude.indexOf(rows[a]['e-mail'].toLowerCase())==-1) {
							rows[a].from = rows[a].person+" <"+emails[rows[a].person]+">";
							rows[a].subject = req.body.subject.replace('[org_name]',rows[a].organizationfestival);
							rows[a].message = req.body.message.replace('[name]',rows[a].name).replace('[signature]',rows[a].person)+signature;
							rows[a].server = {
								user:    emails[rows[a].person], 
								password:passwords[rows[a].person], 
								host:    "smtp.gmail.com", 
								ssl:     true
								
							}
							to.push(rows[a]);
						}
					}
				    if (req.body.send==1) {
				    	console.log("STO INVIANDO!!!")
				    	var failed = [[],[]];
				    	var success = [[],[]];
						to.forEach(function(item, index, theArray) {
							if (item) {
								EM.sendMail(item.server, {
								   text:    item.message, 
								   from:    item.from,
								   //to:      ,
								   to:      (req.body.realsend==1 ? item.name+" "+item.surname+" <"+item['e-mail']+">" : item.name+" "+item.surname+" <"+"g.delgobbo@flyer.it"+">"),
								   subject: item.subject
								}, function(err, message) {
									console.log(message);
									to[index].msg = err ? "Message NOT sent" : "Message sent";
									if (err) {
										failed[0].push(item.name+" "+item.surname+" <"+item['e-mail']+">");
										failed[1].push(item.name+" "+item.surname+"	"+item.name+"	"+item.surname+"	"+item['e-mail']+"");
									} else {
										success[0].push(item.name+" "+item.surname+" <"+item['e-mail']+">");
										success[1].push(item.name+" "+item.surname+"	"+item.name+"	"+item.surname+"	"+item['e-mail']+"");
									}
									if (index==to.length-1) {
    									res.render('spreadsheet', { locals: {title:"Partners Manager", countries : CT},post:req.body,results:to,failed:failed, success:success});
									}
								});
							} 
						});
						/*
						for(var a=0;a<e.locations.length;a++){
							EM.sendMail({
							   text:    text, 
							   to:      o.email,
							   subject: _config.sitename + " | " + __("Signup confirmation")
							}, function(err, message) {
								res.render('forms/user_signup', {  locals: {title : "Signup", result:record,msg:{c:[{m:m}]}}, user : req.session.user });
							});
						}
						*/
				    } else {
		    			res.render('spreadsheet', { locals: {title:"Partners Manager", countries : CT},post:req.body,results:to,failed:[[],[]], success:[[],[]] });
				    }
		            //rows[0].colname = 'new val';
		            //rows[0].save();
		            //rows[0].del();
		        });
		    });
		});
	} else {
	    res.render('spreadsheet', { locals: {title:"Partners Manager", countries : CT},post:req.body,results:[],failed:[[],[]], success:[[],[]] });
	}
	/*
	my_sheet.getRows( 1, function(err, row_data){
	    console.log( err)
	    console.log( row_data)
	    console.log( 'pulled in '+row_data + ' rows ')
	})
	    // column names are set by google based on the first row of your sheet
	    my_sheet.addRow( 2, { colname: 'col value'} );
	
	    my_sheet.getRows( 2, {
	        start: 0,            // start index
	        num: 100            // number of rows to pull
	    }, function(err, row_data){
	        // do something...
	    });
	*/
};
