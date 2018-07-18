const logger = require(global._ROOT + '/log/logger');
const axios = require('axios');
const https = require('https');
const _ = require('underscore');
const btoa = require('btoa');
const querystring = require('querystring');

function getFormattedEmails(emails) {
    let formattedEmails = "";
    _.each(emails, function (fromAddress) {
        if (!_.isEmpty(fromAddress.name)) {
            formattedEmails += fromAddress.name + " <" + fromAddress.email + ">,"
        } else {
            formattedEmails += fromAddress.email + ","
        }
    });
    return formattedEmails;
}

class MailGun {
    getApiClient() {
        let headers = {
            'Authorization': 'Basic ' + btoa(global._MAILGUN_USER + ':' + global._MAILGUN_API_KEY),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        return axios.create({
            baseURL: 'https://api.mailgun.net/v3/sandboxd29c7f706c634afa8a93d5b5350a7f0b.mailgun.org',
            timeout: 8000,
            headers: headers,
            httpsAgent: new https.Agent({
                rejectUnauthorized: true
            }),
            withCredentials: true
        });
    }

    send(req) {
        let data = this.parseData(req);
        return this.getApiClient().post('/messages', querystring.stringify(data));
    }

    parseData(req) {
        var data = {};
        data['subject'] = req.body.subject;
        data['from'] = req.body.from.name + ' <' + req.body.from.email + '>';
        data['to'] = getFormattedEmails(req.body.to);
        if (!_.isEmpty(req.body.cc)) {
            data['cc'] = getFormattedEmails(req.body.cc);
        }
        if (!_.isEmpty(req.body.bcc)) {
            data['cc'] = getFormattedEmails(req.body.bcc);
        }
        if (req.body.content.type.indexOf("html") > 0) {
            data['html'] = req.body.content.value;
        } else {
            data['text'] = req.body.content.value;
        }
        return data;
    }
}

module.exports = new MailGun;