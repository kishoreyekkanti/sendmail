const logger = require(global._ROOT + '/log/logger');
const Mail = require(global._ROOT + '/models/mail');
const mail = new Mail;
const _ = require('underscore');
const sendGrid = require(global._ROOT + '/mail/providers/sendgrid');
const mailgun = require(global._ROOT + '/mail/providers/mailgun');


class MailController {

    send(req, res) {
        let validationResult = mail.validate(req.body);
        if (validationResult.errors.length > 0) {
            let messages = this.extractErrorMessages(validationResult);
            res.send(400, {errors: messages})
        } else {
            let totalEmails = req.body.to.length + (req.body.cc ? req.body.cc.length : 0) + (req.body.bcc ? req.body.bcc.length : 0);
            logger.info({"request_id": req.req_id}, "Received request to send total of %d emails from %s ", totalEmails, req.body.from.email);
            sendGrid.send(req)
                .then(function (result) {
                    logger.info({"request_id": req.req_id}, result.data, "Processed emails with SendGrid");
                    res.send(200, buildResponseForProvider(result, 'SendGrid'));
                }).catch(function (err) {
                //Excluding Bad requests(400), for any other type of errors retry with mailgun.
                if (err.response && err.response.status > 400) {
                    let message = getErrorMessage(err);
                    logger.error({"request_id": req.req_id}, "****FAILING OVER TO MAILGUN**** for reason '" + message + "'");
                    processWithMailGun(req, res);
                } else {
                    captureMessageAndSendError(err, res);
                }
            });
        }

    }

    extractErrorMessages(validationResult) {
        let messages = _.pluck(validationResult.errors, "stack");
        messages.forEach(function (message, i) {
            messages[i] = message.replace("instance.", "");
        });
        return messages;
    }
}

function processWithMailGun(req, res) {
    mailgun.send(req)
        .then(function (result) {
            logger.info({"request_id": req.req_id}, result.data, "Processed emails with MailGun");
            res.send(200, buildResponseForProvider(result, 'MailGun'));
        })
        .catch(function (sendGridErr) {
            logger.error({"request_id": req.req_id}, getErrorMessage(sendGridErr));
            logger.error({"request_id": req.req_id}, "**** UNABLE TO PROCESS EMAILS BOTH WITH SENDGRID AND MAILGUN ****");
            captureMessageAndSendError(sendGridErr, res);
        })
}

function getErrorMessage(err) {
    let message = "";
    if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
    } else {
        message = err.message;
    }
    return message;
}

function captureMessageAndSendError(err, res) {
    let message = getErrorMessage(err);
    res.send(500, {"error": message || "unable to send email"});
}

function buildResponseForProvider(result, providerUsed) {
    return {
        "message": "Request Sent successfully",
        "provider_used": providerUsed,
        "provider_message": result.data
    };
}


module.exports = MailController;