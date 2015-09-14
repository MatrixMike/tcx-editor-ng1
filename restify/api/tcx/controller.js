'use strict';

var fs = require('fs'),
	path = require("path"),
	Busboy = require('busboy');

var xml2js = require('xml2js'),
	parser = new xml2js.Parser(),
	builder = new xml2js.Builder();

// GET
exports.test = function(req, res) {
	var fname = path.join(__dirname, '../../tmp/test1.tcx');
	// console.log(fname);
	genJson(fname, (data) => res.json(data) );
};

// POST /tcx
// writes file to disk so it can be requested separately by client
exports.Json2TcxFile = function (req, res, next) {
	var dname = __dirname + '/../../../tmp/';
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

// POST
exports.TCX2Json = function (req, res, next) {
	// busboy ...
	var busboy = new Busboy({ headers: req.headers });

	var fileBuffer = new Buffer('');

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		file.on('data', function(data) {
			console.log('receive: File [' + filename + '] got ' + data.length + ' bytes');
			fileBuffer = Buffer.concat([fileBuffer, data]);
		});

		file.on('end', function() {
			console.log('File [' + fieldname + '] Finished');
			genJsonFromString(fileBuffer.toString(), function(data) {
				res.json(data);
			});
		});

	});

	busboy.on('finish', function() {
		console.log("'finish'");
	});

	req.pipe(busboy);
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


// exports.receive = function (req, res, next) {
// 	var data = _.pick(req.body, 'type');
// 	// var uploadPath = path.normalize(/server/uploads);
// 	var file = req.files.file;

// 	// console.log(file.name); //original name (ie: sunset.png)
// 	console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
// 	// console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)

// 	genJson(file.path, function(data) {
// 		res.json(data);
// 	});
// };
