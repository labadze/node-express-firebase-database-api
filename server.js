const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');
const jwt = require('jsonwebtoken');
const options = {};

const port = process.env.PORT || 5400;
const server = http.createServer(app);


server.listen(port, '127.0.0.1', () => {
    console.log("HTTP server running at address : " + server.address().address + " and port : " + server.address().port);
    console.log('You can connect this server link below');
    console.log('http://' + server.address().address + ':' + server.address().port)
});
