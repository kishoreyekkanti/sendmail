
global._ROOT = process.env.PWD;

const specHelpers = require('../spec_helpers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
chai.use(chaiHttp);

let sendgrid = require('../../mail/providers/sendgrid');

jest.mock('../../mail/providers/sendgrid');
jest.mock('../../mail/providers/mailgun');


describe('Mailer Api', () => {
    test("Should respond with validation errors if the input is wrong", (done) => {
        let inputData = specHelpers.buildInputData(false, true, true, true);
        return chai.request(server)
            .post("/mail/send")
            .send(inputData)
            .then(res => {
                expect(res.status).toEqual(400);
                expect(res.body.errors.length).toEqual(1);
                expect(res.body.errors[0]).toEqual('from.email is required');
                done();
            })
    });


    test("Should send the email via SendGrid", (done) => {
        let inputData = specHelpers.buildInputData(true, true, true, true);
        sendgrid.send.mockResolvedValue({data: "resolved"});
        chai.request(server)
            .post("/mail/send")
            .send(inputData)
            .end((err, res) => {
                expect(res.body.provider_used).toEqual('SendGrid');
                expect(res.body.message).toEqual('Request Sent successfully');
                expect(res.status).toEqual(200);
                done();
            });
    });

});

