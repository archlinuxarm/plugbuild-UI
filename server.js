/*
 * PlugBuild socket router
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 * Copyright © 2012 Jason Plum <max@warheads.net>
 */
 
var path	= require('path');
var os		= require('os');
var fs		= require('fs');
var util	= require('util');
var crypto	= require('crypto');
var express = require('express');
var net     = require('net');
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

var io;

// testing use of a global variable for the structured store
var package_store;
var builder_state = {};

/***************************************************************/
// set up builder connection, will this reconnect if the builder restarts?

var BHOST = 'localhost';
var BPORT = 2122;
var build_buffer = ''; // buffer for messages from the builder
var builder = new net.Socket();

function sendToBuilder(command){
    builder.write(JSON.stringify(command));
}

builder.setEncoding('utf8');

builder.on('error', function(error) {
    console.log('Error connecting to builder: ' + error);
});
builder.on('data', function(data) {
    if( data.toString().charCodeAt(data.length-1) != 0 ) {
        // append
        build_buffer+=data.toString();
    }else{
        // append & parse
        build_buffer+= data.toString().substr(0,data.length-1);
        var message = JSON.parse(build_buffer);
        build_buffer = '';
        switch (message.command) {
            case "echo":
                console.log('Got successful echo: ' + message.session);
                io.sockets.in(message.session).emit('console',message);
                break;
            case "dump":
                var package_snapshot = message.dump; 
                package_store = package_snapshot;
                console.log('Received initial package snapshot');
                break;
            case "console":
				io.sockets.emit('console',message.console);
				console.log('Package update: ' + package.package);
                break;
            case "update":
                var type = message.type;
                if (type == 'package') {
                    var package = message.package;
                    var name = package['name'];
                    package_store[name] = package;
                    io.sockets.emit('package',package);
                    console.log('Package update: ' + package.package);
                }
                else if (type == 'builder') {
                    var bdata = message.builder;
                    var fqn = bdata['fqn'];
                    builder_state[fqn] = bdata;
                    io.sockets.emit('builder',bdata);
                    console.log('Builder: ' + bdata.fqn + ', state: ' + bdata.state);
                }           
                //
                break;
            default:
                // wtf eh?
                console.log('Unhandled message: ' + message);
                break;
        }
    }
});

builder.on('close', function() {
    console.log('Builder socket exited!');
});

builder.connect(BPORT, BHOST, function() {
    console.log('Builder connected');
    sendToBuilder({ command: "dump" });
});




/***************************************************************/
// create a webserver with https and client cert auth

var app = module.exports = express.createServer({
    key: fs.readFileSync('/etc/plugbuild/server.key'),
    cert: fs.readFileSync('/etc/plugbuild/server.crt'),
    ca: fs.readFileSync('/etc/plugbuild/cacert.pem'),
    requestCert: true,
    rejectUnauthorized: true
});

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.session({
        store   : sessionStore,
        secret  : 'ununewh8wq3', 
        key     : 'plugsid'
    }));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use("/static", express.static(__dirname + '/static'));
	
	// disable layout
	app.set("view options", {layout: false});
    app.set('views', __dirname + '/views'); //set the views dir 
	app.register('.html', {
		compile: function(str, options){
			return function(locals){
				return str;
			};
		}
	});
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// the only actual web route, just serves the core page which then makes a bunch of static requests 
app.get('/', function(req, res){
	res.render('core.html');
    var user = req.connection.getPeerCertificate().subject.CN;
    console.log('New web connection from: ' + user);
    // store in session?
    req.session.userCN = user;
    req.session.touch();
});


var parseCookie = require('connect').utils.parseCookie;

/***************************************************************/
//  piggyback socket.io on to the webserver

io = require('socket.io').listen(app);
io.set('log level',1);
io.set('authorization', function (data, accept) {
    // cookie?
    if( data.headers.cookie ) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['plugsid'];
        // get the data from the store.
        sessionStore.get(data.sessionID, function (err,session) {
            if ( err || !session ) {
                // no seesion, reject
                accept('Session Error',false);
            }else{
                // save to data & accept
                data.session = session;
                accept(null,true);
            }
        });
    } else {
        accept('No cookie transmitted',false);
    }
});

io.sockets.on('connection',function(socket){
    console.log('socket connection: '+socket.handshake.session.userCN);
    
    socket.join(socket.handshake.sessionID);
    
    socket.emit('init', { user: socket.handshake.session.userCN, packages: package_store, builders: builder_state } );
    
    socket.on('echo',function(data){
        console.log(data);
        sendToBuilder({
            command : 'echo',
            user    : socket.handshake.session.userCN,
            session : socket.handshake.sessionID,
            consoleline    : data.consoleline
        });
    });
    
    socket.on('test',function(data){
        console.log(data);
        sendToBuilder({
            command : 'echo',
            user    : socket.handshake.session.userCN,
            session : socket.handshake.sessionID,
            data    : data
        });
    });
});


io.sockets.on('disconnect',function(){
    console.log('socket disconnected');
});

setInterval(function() {
	var status = {};
	var freemem 		= os.freemem();
	var totalmem 		= os.totalmem();
	status.freemem		= freemem;
	status.memused		= totalmem - freemem;
	status.loadavg		= os.loadavg();
	status.uptime		= os.uptime();
	status.memory_total	= totalmem;
	io.sockets.emit('status', status);
}, 10000);


/***************************************************************/
// start the webserver 
app.listen(7050);



