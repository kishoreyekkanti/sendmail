global._ROOT = process.env.PWD;
let nconf = require('nconf').argv().env();
let restify = require('restify');
let logger = require(global._ROOT + '/log/logger');
let nconfENV = nconf.get('NODE_ENV') || 'DEVELOPMENT';
const uuidv4 = require('uuid/v4');
console.log("********** Running in " + nconfENV + " environment ****************");

global._ENVIRONMENT = nconfENV;
global._MAILGUN_USER = nconf.get('MAILGUN_USER');
global._MAILGUN_API_KEY = nconf.get('MAILGUN_API_KEY');
global._SEND_GRID_API_KEY = nconf.get('SEND_GRID_API_KEY');

let server = restify.createServer({
    name: 'send-mailer-service',
    log: logger
});
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
server.use(restify.plugins.requestLogger());
server.use(function (req, res, next) {
    req.connection.setTimeout(10000);
    next();
});

//Set unique id for each request, if the request have a cookie by name unique_id
//use it else generate a unique request id
server.use(function (req, res, next) {
    let uniqueId = req.header('X-Request-Id') || uuidv4();
    req.req_id = uniqueId || req.req_id;
    res.setHeader('X-Request-Id', req.req_id);
    next();
});

let port = process.env.PORT || '3000';

require(global._ROOT + '/routes/index')(server);

if (global._SEND_GRID_API_KEY || (global._MAILGUN_USER && global._MAILGUN_API_KEY)) {
    server.listen(port, function () {
        logger.info('Send Email Service listening on port ' + port);
    });
} else {
    logger.info("PLEASE PROVIDE EITHER SEND_GRID_API_KEY OR MAILGUN_USER AND MAILGUN_API_KEY.");
}

module.exports = server;
