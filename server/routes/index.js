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

    // app.use(express.static(path.join(__dirname, '../../angular')));
    app.use(express.static(path.join(__dirname, '../../dist')));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../tmp')));

    app.route('/*').get(function(req, res, next) {
    // router.get('/*', function(req, res, next) {
        res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });
}

// module.exports = router;
