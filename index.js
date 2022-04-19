// Place your server entry point code here

// minimist for arguments
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))

// Require database.js
const db = require('./services/database.js');
// Require morgan
const morgan = require("morgan")
// Require fs
const fs = require("fs")

//if --help option is included, don't init anything, return help msg and exit
if (args.help == true) {
    console.log(`server.js [options]
    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
  
    --debug	If set to \`true\`, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                \`false\`.
  
    --log		If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
  
    --help	Return this message and exit.`)
    process.exit(0);
}

const port = args.port || process.env.PORT || 3000

// express.js
const express = require('express')
const app = express()
// json compatibility for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// start server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

// Serve static HTML files
app.use(express.static('./public'));

// middleware to insert new record into database
app.use( (req, res, next) => {
    // Your middleware goes here.
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    console.log(logdata)
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, secure, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.secure, logdata.status, logdata.referer, logdata.useragent)
    next()
    })

    
if (args.debug) {
    app.get('/app/log/access', (req, res) => {
        const stmt = db.prepare('SELECT * FROM accesslog').all()
        res.status(200).json(stmt)
    });

    app.get('/app/error', (req, res) => {
        throw new Error('Error test successful.') // Express will catch this on its own.
    });

    // add logging
    if (args.log) { 
        const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a'})
        app.use(morgan('combined', {stream: WRITESTREAM}))   
    }
}


// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});
