
<!-- DELETE EVERYTHING ABOVE THIS LINE -->

# Coinserver Description

This package exposes endpoints and provides a web interface to emulate random chance coin flip events in the following ways:

1. Flip one coin - returns result of a coin flip
2. Flip many coins - returns the results of many coin flips with a summary
3. Guess a coin flip and - returns the result of a flip and guess match

# Coinserver Installation

Run `npm install` inside the package root directory.

This package was buid using Node.js LTS (16.x).
Other package dependency and version information can be found in `package.json`.

# Coinserver Runtime Documentation
```
node server.js [options]

--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535. Defaults to 5000.

--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log, -l   If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help, -h	Return this message and exit.
```

# Coinserver API Documentation

## Endpoints

### /app/ (GET)

#### Request cURL

```
curl http://localhost:5000/app/
```

#### Response body

```
{"message":"Your API works! (200)"}
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-KNmhzXgQhtEE5ovS3fuLixylNK0"
Date: Thu, 07 Apr 2022 15:07:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### /app/flip/ (GET)
 * Will flip a coin and log flip result in terminal

#### Request cURL

```
curl http://localhost:5000/app/flip/

```

#### Response body

```
{flip: 'heads'}
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/plain
Date: Tue, 26 Apr 2022 21:37:51 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### /app/flips/:number/ (GET)
 * Deprecated as endpoint interfered with post and json objects, see /app/flips/ (POST)


### /app/flips/ (POST)
 * Flips amount of coins specified in form on multi div, returns:
  * raw - results of flips 
  * summary - condensed summary of flips
#### Request cURL

```
curl -X POST -H 'Content-Type: application/json' -d '{"number":"3"}' http://localhost:5000/app/flips/
```

#### Response body

```
raw: (3) ['"heads"', '"tails"', '"heads"']
summary: {tails: 1, heads: 2}
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/plain
Date: Tue, 26 Apr 2022 21:46:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```


### /app/flip/call/:guess/ (GET)
 * Deprecated as endpoint interfered with post and json objects, see /app/flip/call/ (POST)


### /app/flip/call/ (POST)
 * Sends guess of coin flip to server
 * Returns:
    * "call" - initial guess
    * "flip" - actual coin flip result
    * "result" - win or loss dependent on call and flip matching
#### Request cURL

```
curl -X POST -H 'Content-Type: application/json' -d '{"guess":"heads"}' http://localhost:5000/app/flip/call/
```

#### Response body

```
{"call":"heads","flip":"heads","result":"win"}
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 46
ETag: W/"2e-U/q8iZ4JKqczXPIvtwiVRpEFlRc"
Date: Thu, 07 Apr 2022 16:30:07 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### /app/flip/coins/ (POST)
* Flips provided number of coins and return results in two arrays
* Returns "raw" that lists all flips
* Returns "summary" that condenses all flips into numerical values of each flip
#### Request cURL

```
curl -X POST -H 'Content-Type: application/json' -d '{"number":"30"}' http://localhost:5000/app/flip/coins/`
```

#### Response body

```
{"raw":["heads","heads","heads","tails","heads","heads","tails","tails","tails","heads","heads","heads","heads","heads","heads","tails","tails","heads","heads","heads","heads","heads","heads","heads","tails","heads","tails","heads","tails","heads"],"summary":{"heads":21,"tails":9}}
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 283
ETag: W/"11b-9dPTqGfngSPFEOq4loChIlpdSIE"
Date: Thu, 07 Apr 2022 15:23:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### /app/log/access/ (GET)

#### Request cURL

```
curl http://localhost:5000/app/log/access/
```

#### Response body

```
[{"id":1,"remoteaddr":"::ffff:127.0.0.1","remoteuser":null,"time":"1651010647229.0","method":"GET","url":"/app/log/access/","protocol":"http","httpversion":"1.1","secure":null,"status":"200.0","referer":null,"useragent":"curl/7.74.0"}]
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 470
ETag: W/"1d6-AmoJP5Gqo70rzp2AO07L3cQspzo"
Date: Tue, 26 Apr 2022 22:04:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### /app/log/error/ (GET)
 * Returns an error log of server

#### Request cURL

```
curl http://localhost:5000/app/log/error
```

#### Response body

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Error: Error test successful.<br> &nbsp; &nbsp;at /home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/index.js:86:15<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at next (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/route.js:137:13)<br> &nbsp; &nbsp;at Route.dispatch (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/route.js:112:3)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at /home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/index.js:281:22<br> &nbsp; &nbsp;at Function.process_params (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/index.js:341:12)<br> &nbsp; &nbsp;at next (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/index.js:275:10)<br> &nbsp; &nbsp;at /home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/index.js:75:5<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/home/fchiave/github-classroom/comp426-2022-spring/a05-fchiave/node_modules/express/lib/router/layer.js:95:5)</pre>
</body>
</html>
```

#### Response headers

```
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 1554
Date: Tue, 26 Apr 2022 22:11:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

