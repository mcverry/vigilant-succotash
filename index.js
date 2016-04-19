var express = require('express');
var server = express(); // better instead

server.get('/ludumdare.min.js', function(req, res) {
	res.sendfile(__dirname + '/dist/ludumdare.min.js');
});

server.use(express.static(__dirname + '/dist/assets'));

server.use('/libs', express.static(__dirname + '/dist/libs'));

server.listen(process.env.PORT || 3000);
