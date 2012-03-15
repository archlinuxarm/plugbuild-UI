/*
 * PlugBuild socket demo provider
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */
 
var path	= require('path');
var os		= require('os');
var fs		= require('fs');
var util	= require('util');
var crypto	= require('crypto');
var spawn = require('child_process').spawn;
var io = require('socket.io');
var express = require('express');


// create an application 
var app = module.exports = express.createServer(
	
);


app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use("/static", express.static(__dirname + '/static'));
	
	// disable layout
	app.set("view options", {layout: false});

	app.register('.html', {
		compile: function(str, options){
			return function(locals){
				return str;
			};
		}
	});
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



app.get('/', function(req, res){
	res.render('index.html');
});



app.listen(8000);



var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
  socket.on('connect', function () { 
	socket.json.send({ response: "hello" });
  
  });  
  socket.on('message', function () { 
	socket.json.send({ response: "received" });
  
  });
  socket.on('disconnect', function () { 
  
  });
});