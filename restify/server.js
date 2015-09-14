var restify = require('restify');
var tcx = require('./api/tcx/controller');

var server = restify.createServer();

server.use(restify.CORS());

server.get('/', tcx.test);
server.get('/tcx', tcx.test);
server.post('/tcx', tcx.TCX2Json);
server.post('/tcx/:fname', tcx.Json2TcxFile);

server.listen(8080, ()  => {
  console.log('%s listening at %s', server.name, server.url);
});
