#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').config();
const debug = require('debug')('api:server');
const http = require('http');
const config = require('../config/config');
global.Config = new config();
global.Mongoose = require('mongoose');

const startServer = async () => {

  try {
    // Loading config
    await Config.init();
    const app = require('../app');
    
    /**
     * Get port from environment and store in Express.
     */

    let port = normalizePort(Config.get('App').PORT || '3000');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    let server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    console.log(`Server is listening to port ${port}`);

    server.on('error', onError);
    server.on('listening', onListening);

    function normalizePort(val) {
      let port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      let addr = server.address();
      let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }

  } catch (e) {
    console.log('Secret Manager not working', e);
    process.exit(1);
  }

};
startServer().then(r => console.log('Core Server successfully running'));


/**
* Normalize a port into a number, string, or false.
*/


