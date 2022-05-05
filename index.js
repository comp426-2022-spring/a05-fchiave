// Place your server entry point code here

// Import coin methods
const fl = require("./src/routes/someroutes")
// minimist for arguments
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))

// Require database.js
const db = require('./src/services/database.js');
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
// Add cors dependency
const cors = require('cors')
// Set up cors middleware on all endpoints
app.use(cors())



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

    app.get('/app/log/error', (req, res) => {
        throw new Error('Error test successful.') // Express will catch this on its own.
    });

    // add logging
    if (args.log) { 
        const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a'})
        app.use(morgan('combined', {stream: WRITESTREAM}))   
    }
}

//endpoints
app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

app.get('/app/flip/', (req, res) => {
    // HTTP responses, using mozilla status codes
    res.statusCode = 200;
    res.statusMessage = 'OK'
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });

    // String cleanup to get last part of path easily
    const path = req.path.substring(0, req.path.length-1)
    // Call flip module and set end with result
    res.end("{\"" + path.substring(path.lastIndexOf('/') + 1) + "\":\"" + fl.coinFlip() + "\"}")})

app.post('/app/flips/', (req, res) => {
    // param validation - check if integer
    if (!Number.isInteger(parseInt(req.body.number))) {
        // HTTP responses, using mozilla status codes
        res.statusCode = 400
        res.statusMessage = 'The server cannot process the request due to client error'
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end()
        return
    }
    // HTTP responses, using mozilla status codes
    res.statusCode = 200;
    res.statusMessage = 'OK'
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });

	const flips = fl.coinFlips(req.body.number)
    const sumFlips = fl.countFlips(flips)
    res.end("{\"raw\":[" + flips + "],\"summary\":{\"tails\":" + sumFlips.tails + ",\"heads\":" + sumFlips.heads + "}}")
});

app.post('/app/flip/call/', (req, res) => {
    // param validation
    if (req.body.call !== "tails" && req.body.call !== "heads") {
        // HTTP responses, using mozilla status codes
        res.statusCode = 400
        res.statusMessage = 'The server cannot process the request due to client error'
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end()
        return
    }
    // HTTP responses, using mozilla status codes
    res.statusCode = 200;
    res.statusMessage = 'OK'
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });

	const flip = fl.flipACoin(req.body.call)
    res.end("{\"call\":\"" + flip.call + "\",\"flip\":\"" + flip.flip + "\",\"result\":\"" + flip.result + "\"}")
});

// New endpoint
// Flip a bunch of coins with one body variable (number)
app.post('/app/flip/coins/', (req, res, next) => {
    const flips = fl.coinFlips(req.body.number)
    const count = fl.countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})

// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});
