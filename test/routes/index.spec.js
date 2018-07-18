global._ROOT = process.env.PWD;

const specHelpers = require('../spec_helpers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
chai.use(chaiHttp);

let sendgrid = require('../../mail/providers/sendgrid');
let mailgun = require('../../mail/providers/mailgun');
jest.mock('../../mail/providers/sendgrid');
jest.mock('../../mail/providers/mailgun');


describe('All Routes', () => {

    test("Should Fail over to mailgun when sendgrid fails", (done) => {
        let inputData = specHelpers.buildInputData(true, true, true, true);
        sendgrid.send.mockRejectedValue({response: {status: 502}});
        mailgun.send.mockResolvedValue({data: "resolved"});
        return chai.request(server)
            .post("/mail/send")
            .send(inputData)
            .end((err, res) => {
                expect(res.body.message).toEqual('Request Sent successfully');
                expect(res.body.provider_used).toEqual('MailGun');
                expect(res.status).toEqual(200);
                done();
            });
    });

});

