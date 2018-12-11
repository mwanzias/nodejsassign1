"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const urlC = require("url");
const string_decoder_1 = require("string_decoder"); //stringdecoder.;
var port = process.env.port || 4000;
const server = http.createServer();
server.on("request", (req, res) => {
    const { method, url } = req;
    var paths = urlC.parse(url, true).pathname;
    console.log('This is the path = ', paths);
    const choosenHandler = typeof (router[paths]) !== 'undefined' ? router[paths] : handlers['notFound'];
    console.log('choosenhandler', choosenHandler);
    var decoder = new string_decoder_1.StringDecoder('utf-8');
    var buffer = '';
    res.on("error", (err) => {
        res.writeHead(400, { 'content-type': 'application/json', 'X-Powered-By': 'todaytech' });
        res.end(JSON.stringify('{"status":"-1","status_description":"The transaction failed on account of malformed response."}'));
    });
    req.on('data', function (data) {
        buffer += decoder.write(data);
    })
        .on('end', function () {
        buffer += decoder.end();
        console.log('buffer Received ', buffer);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'todaytech'
        });
        var contentType = "application/json";
        //Call the choosen handler 
        choosenHandler(buffer, function (statusCode, payLoad) {
            console.log('buffer.length=', buffer.length);
            if (buffer.length != 0) {
                // var datadone = JSON.parse(payLoad);
                console.log('buffer value is here :', typeof (JSON.parse(buffer)));
                statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
                payLoad = typeof (JSON.parse(payLoad)) == 'object' ? payLoad : {};
                res.end(payLoad);
            }
            else {
                res.end(JSON.stringify({}));
            }
            //'{"status":"0","status_description":"The transaction successfully committed."}'))
        });
    }).on("error", (err) => {
        res.writeHead(400, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'todaytech'
        });
        res.end(JSON.stringify('{"status":"-1","status_description":"The transaction failed: bad Request."}'));
    });
});
server.on("clientError", (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(port, function () {
    console.log('The server has started well now, listening on port 4000');
});
//define routes for the applications 
var handlers = function () {
    var hello = function () { };
    var notFound = function () { };
};
handlers['hello'] = function (data, callback) {
    console.log('received data', data);
    const procdata = JSON.parse(data);
    var name = procdata.name == undefined ? "sender" : procdata.name;
    console.log('Name = ', name);
    var greeting = "Welcome " + name + ", Happy to have you around";
    var ret = JSON.stringify({ desc: greeting });
    console.log(ret);
    callback(200, ret);
};
handlers['notFound'] = function (data, callback) {
    callback(404, '{"desc":"route not found"}');
};
var router = {
    '/hello': handlers['hello']
};
//# sourceMappingURL=server.js.map