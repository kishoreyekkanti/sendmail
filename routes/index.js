const MailController = require(global._ROOT + '/controllers/mail_controller');

const mailController = new MailController;

function routes(server) {
    server.post("/mail/send", function (req, res, next) {
        mailController.send(req, res);
    })
}

module.exports = routes;