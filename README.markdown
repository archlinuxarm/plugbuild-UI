##PlugBuild management interface & api server

This code is the beginning of a pure javascript web interface for plugbuild, it isn't finished and will likely never be a public interface, but the code is available.

####Server side

Simple Node.js single process 'router'
	
	★ Relies on http client ssl certificates for auth
	★ Socket.IO for browser communication
	★ TCP socket for talking to the builder itself
	★ Builder state and package building queue events pushed up to the client live

The server essentially acts as an intermediary between browsers and the builder, accepting commands and pushing data back up the stack to the client in realtime

        


####Client side

Backbone.js application

    ★ Socket.IO for talking back to the api router
    ★ Very event based, server pushes data and client responds
    ★ Central dispatcher used for in-process notifications keeps views cleanly separate (pushing/listening vs calling functions/setting properties)    
    ★ Little statically rendered html, mostly managed by backbone views
