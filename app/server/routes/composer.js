var CT = require('../modules/country-list');
var EM = require('../modules/email-dispatcher');
var emails = {Samuele:'s.huynhhong@liveperformersmeeting.net', Gianluca:'g.delgobbo@liveperformersmeeting.net', Chiara:'c.gianniniguazzugli@liveperformersmeeting.net', Fax:'a.familari@liveperformersmeeting.net', Carlotta:'c.piccinini@liveperformersmeeting.net'}
var passwords = {Samuele:'s.huynhhong@liveperformersmeeting.net', Gianluca:'22724gia', Chiara:'c.gianniniguazzugli@liveperformersmeeting.net', Fax:'a.familari@liveperformersmeeting.net', Carlotta:'c.piccinini@liveperformersmeeting.net'}
var signature = "\n______________________________________\nLPM - Live Performers Meeting\nliveperformersmeeting.net\nVia del Verano 39 - 00185 Rome\nTel. +39 06 78147301 Fax +39 06 78390805"


exports.get = function get(req, res) {
	res.render('composer', { locals: {title:"Partners Manager",post:[],results:[],failed:[[],[]], success:[[],[]] }});
};
exports.post = function get(req, res) {
	// console.log(res);
	// without auth -- read only
	// # is worksheet id - IDs start at 1
	// console.log( req.body);
	if (req.body.to && (req.body.message_it || req.body.message_en)) {
		var rows = {}
		var items = JSON.parse(req.body.to)
		for(var a=0;a<items.length;a++){
			var i = items[a][1]+"_"+items[a][4];
			if (typeof(rows[i])=="undefined") rows[i] = {}
			rows[i].from = req.body.from_name+" <"+req.body.from_email+">";
			rows[i].to = items[a][2]+" "+items[a][3]+" <"+items[a][4]+">";
			rows[i].from_html = req.body.from_name+" &lt;"+req.body.from_email+"&gt;";
			rows[i].to_html = items[a][2]+" "+items[a][3]+" &lt;"+items[a][4]+"&gt;";
			rows[i].subject = req.body.subject.replace('[org_name]',items[a][1]);
			rows[i].lang = items[a][0];
			rows[i].message = req.body["message_"+items[a][0]].replace('[name]',items[a][2]).replace('[signature]',req.body.from_name)+signature;
			rows[i].server = {
				user:    req.body.from_email, 
				password:req.body.from_password, 
				host:    "smtp.gmail.com", 
				ssl:     true
				
			}
		}
		var rowsA = [];
		for(var b in rows) rowsA.push(rows[b]);
		res.render('composer', { locals: {title:"Partners Manager",post:req.body,results:rowsA,failed:[[],[]], success:[[],[]] }});
	} else {
		res.render('composer', { locals: {title:"Partners Manager",post:req.body,results:[],failed:[[],[]], success:[[],[]] }});
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
