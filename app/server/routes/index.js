var CT = require('../modules/country-list');
var GoogleSpreadsheet = require("google-spreadsheet");
var EM = require('../modules/email-dispatcher');
var emails = {Samuele:'s.huynhhong@liveperformersmeeting.net', Gianluca:'g.delgobbo@liveperformersmeeting.net', Chiara:'c.gianniniguazzugli@liveperformersmeeting.net', Fax:'a.familari@liveperformersmeeting.net', Carlotta:'c.piccinini@liveperformersmeeting.net'}
var passwords = {Samuele:'s.huynhhong@liveperformersmeeting.net', Gianluca:'22724gia', Chiara:'c.gianniniguazzugli@liveperformersmeeting.net', Fax:'a.familari@liveperformersmeeting.net', Carlotta:'c.piccinini@liveperformersmeeting.net'}
var signature = "\n______________________________________\nLPM - Live Performers Meeting\nliveperformersmeeting.net\nVia del Verano 39 - 00185 Rome\nTel. +39 06 78147301 Fax +39 06 78390805"


exports.get = function get(req, res) {
	res.render('index', { locals: {title:"Menu Manager",post:[],results:[],failed:[[],[]], success:[[],[]] }});
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
				var result = [];
				sheet_info.worksheets.forEach(function(element, index, array) {
						var tmp = {title:element.title,items:[]};
						element.getRows( function( err, rows ){
							tmp.items = rows;
							result.push(tmp)
							if (index == array.length-1) {
								result.sort(function (a,b) {
										if (a.last_nom < b.last_nom)
											return -1;
										if (a.last_nom > b.last_nom)
											return 1;
										return 0;
									}
									
								);
								res.render('index', { locals: {title:"Menu Manager",post:req.body,results:result}});
							}
						});
					}
				)
			});
		});
	} else {
		res.render('index', { locals: {title:"Menu Manager",post:req.body,results:[],failed:[[],[]], success:[[],[]] }});
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
			start: 0,			// start index
			num: 100			// number of rows to pull
		}, function(err, row_data){
			// do something...
		});
	*/
};
