var express = require('express');
var router = express.Router();
var path = require('path');

var tcx = require('../api/tcx');
var analytics = require('../api/analytics');
var feedback = require('../api/feedback');

module.exports = function (app) {
    app.use('/tcx', tcx);
    app.use('/analytics', analytics);
    app.use('/comments', feedback);

    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../tmp')));

    if (process.env.NODE_ENV === "development") {
        console.log("loading dev routes");
        app.use(express.static(path.join(__dirname, '../../src')));
        app.use(express.static(path.join(__dirname, '../../.tmp')));

        app.route('/*').get(function(req, res, next) {
            res.sendFile(path.join(__dirname, '../../.tmp/index.html'));
        });
    } else {
        app.use(express.static(path.join(__dirname, '../../dist')));

        app.route('/*').get(function(req, res, next) {
            res.sendFile(path.join(__dirname, '../../dist/index.html'));
        });
    }

}

// module.exports = router;
