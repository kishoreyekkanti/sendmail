let bunyan = require('bunyan');
let log = bunyan.createLogger({name: 'send-email-service', streams: [
        {
            type: 'rotating-file',
            path: "send-email-service.log",
            period: '1d',
            level: 'info',
            count: 30
        },
        {
            level: 'info',
            stream: process.stdout
        }
    ],
    serializers: bunyan.stdSerializers,
    src: true
});
module.exports = log;
