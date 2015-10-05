"use strict";

var debug = process.env.NODE_ENV === 'development';
var mailgun = require('mailgun-js')({
	apiKey: process.env.MAILGUN_KEY,
	domain: process.env.MAILGUN_DOMAIN
});

var oio = require('orchestrate');
var db = oio(process.env.ORCHESTRATE_KEY, "api.aws-eu-west-1.orchestrate.io");
var coll = (debug) ? "tcxeditor-dev" : "tcxeditor";

var getAllComments = function(withEmail, cb) {
	if (debug) console.log("Getting data from collection: ", coll);

	db.list(coll)
	.then(function(result) {
		var items = result.body.results;
		console.log("got %s results", result.body.results.length);

		// clean up dates before sending to client
		var comments = items.map(function(item) {
			let tmp = new Date(item.value.date);
			let res = {
				date: tmp.toDateString(),
				comment: item.value.comment
			};

			if (withEmail)
				res.email = item.value.email;

			return res;
		});
		cb(null, comments);
		// return comments
	})
	.fail(function(err) {
		console.log(err);
		cb(err);
	});
};

// Get list of feedbacks
exports.index = function(req, res) {
	getAllComments(true, (err, data) => {
		if (err) res.status(500).send(err);
		res.send(data);
	});
};

// Handle new comment, including send a copy to developer
exports.postComment = function(req, res) {
	var now = new Date();
	var data = {
	  "date": now.toString(),
	  "email": req.body.email,
	  "comment": req.body.comment
	}
	if (debug) console.log("postComment: inserting to collection: '%s', '%s'", coll, JSON.stringify(data));

	db.post(coll, data)
	.then(function (response) {
		// if (debug) console.log("postComment: ", response);

		var data = {
		  from: 'TCX-editor <me@tcxeditor.mailgun.org>',
		  to: 'hotbelgo@gmail.com',
		  subject: 'TCX-editor comment',
		  text: "From: "+req.body.email + " Message: "+ req.body.comment
		};

		mailgun.messages().send(data, function (err, body) {
			if (err) throw err;
			if (debug) console.log('mailgun: ', body);
		});

		getAllComments(false, (err, data) => {
			if (err) res.status(500).send("error!!!!!")
			res.send(data)
		});
	})
	.fail(function (err) {
		res.send("Error: ", err);
	});
};

// exports.delete = function(req, res) {
// 	db.list(coll)
// 	.then( result => {
// 		var items = result.body.results;
// 		console.log("deleting %s items", items.length);
//
// 		items.forEach(item => {
// 			db.remove(coll, item.path.key)
// 			.then( result => {
// 				console.log(item.path.key, result);
// 			})
// 			.fail( err => console.error(err) );
// 		});
// 		res.send("working on it")
// 	});
// };
