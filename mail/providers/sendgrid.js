const logger = require(global._ROOT + '/log/logger');
const axios = require('axios');
const https = require('https');

class SendGrid {

    getApiClient() {
        let headers = {
            'Authorization': 'Bearer ' + global._SEND_GRID_API_KEY,
            'Content-Type': 'application/json'
        };
        return axios.create({
            baseURL: 'https://api.sendgrid.com/v3',
            timeout: 8000,
            headers: headers,
            httpsAgent: new https.Agent({
                rejectUnauthorized: true
            }),
            withCredentials: true
        });
    }

    send(req) {
        let data = this.parseData(req)
        return this.getApiClient().post('/mail/send', data);
    }

    parseData(req) {
        var mailData = {
            "personalizations": [
                {
                    "to": req.body.to,
                    "subject": req.body.subject,
                }
            ],
            "from": req.body.from,
            "content": [req.body.content],
        };
        if (req.body.cc) {
            mailData['personalizations']['cc'] = req.body.cc
        }
        if (req.body.bcc) {
            mailData['personalizations']['bcc'] = req.body.bcc
        }
        return mailData;
    }
}

module.exports = new SendGrid;