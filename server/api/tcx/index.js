var express = require('express');
var router = express.Router();
var controller = require('./controller')

// router.get('/test', controller.test);
router.post('/tojson', controller.TCX2Json);
router.post('/fromjson/:fname', controller.Json2TcxFile);

module.exports = router;
