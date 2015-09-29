var debug = process.env.NODE_ENV === 'development';
var oio = require('orchestrate');
var db = oio(process.env.ORCHESTRATE_KEY, "api.aws-eu-west-1.orchestrate.io");

var fs = require('fs'),
	path = require("path"),
	Busboy = require('busboy');

var xml2js = require('xml2js'),
	parser = new xml2js.Parser(),
	builder = new xml2js.Builder();

// GET
exports.test = function(req, res) {
	// var fname = path.join(__dirname, '../../tmp/test.tcx');
	var fname = path.join(__dirname, '../../tmp/noposdata.tcx');
	// console.log(fname);
	genJson(fname, (data) => res.json(data) );
};

// 1) POST
exports.TCX2Json = function (req, res, next) {
	// busboy ...
	var busboy = new Busboy({ headers: req.headers });

	var fileBuffer = new Buffer('');

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		file.on('data', function(data) {
			// console.log('receive: File [' + filename + '] got ' + data.length + ' bytes');
			fileBuffer = Buffer.concat([fileBuffer, data]);
		});

		file.on('end', function() {
			console.log('File [' + fieldname + '] Finished');
			genJsonFromString(fileBuffer.toString(), function(data) {
				res.json(data);
				var loc = data.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0].Trackpoint[0].Position[0];
				// Save a copy of location for analytics
				db.post('tcx-locations', {
					lat: loc.LatitudeDegrees[0],
					lng: loc.LongitudeDegrees[0]
				})
				.then(res => console.log(res).bind(console));
			});
		});

	});

	busboy.on('finish', function() {
		console.log("'finish'");
	});

	req.pipe(busboy);
};

// 2) POST /tcx
// writes file to disk so it can be requested separately by client
exports.Json2TcxFile = function (req, res, next) {
	var dname = path.join(__dirname, '/../../tmp/');
	var fname = dname + req.params.fname;

	console.log('createTCX: write to temporary file:', fname);

	if (!fs.existsSync(dname)) {
		fs.mkdirSync(dname);
	}

	var xml = builder.buildObject(req.body);

	fs.writeFile(fname, xml, function(err) {
		if (err) throw err;
		res.send(200);
	});
};

/*
 * HELPERS
 * genJson -
 * genJsonFromString -
 */

var genJson = function(filename, cb) {
	return fs.readFile(filename, function(err, data) {
		if (err) throw err;
		return parser.parseString(data, function (err, result) {
			if (err) throw err;
			cb(result);
		});
	});
};

var genJsonFromString = function(str, cb) {
	return parser.parseString(str, function (err, result) {
		if (err) throw err;
		cb(result);
	});
};
