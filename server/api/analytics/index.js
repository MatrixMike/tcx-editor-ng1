var express = require('express');
var router = express.Router();
var controller = require('./analytics.controller');

router.get('/', controller.index);
// router.get('/delete', controller.delete);
// router.post('/', controller.postComment);

module.exports = router;
