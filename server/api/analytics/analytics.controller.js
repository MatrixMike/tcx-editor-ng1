var debug = process.env.NODE_ENV === 'development';

var oio = require('orchestrate');
var db = oio(process.env.ORCHESTRATE_KEY, "api.aws-eu-west-1.orchestrate.io");
var coll = 'tcx-locations';

var getAll = function(cb) {
	if (debug) console.log("Getting data from collection: ", coll);

	db.list(coll)
	.then(function(result) {
		var items = result.body.results.map(p => p.value);
		console.log("got locations", items);

		cb(null, items);
	})
	.fail( cb );
};

// Get list of locations
exports.index = function(req, res) {
	getAll((err, data) => {
		if (err) res.status(500).send(err);
		res.send(data);
	});
};
