global._ROOT = process.env.PWD;
const sendgrid = require(global._ROOT + '/mail/providers/sendgrid');
const specHelpers = require('../../spec_helpers');

test("Should parse request in SendGrid format", () => {
    let inputData = specHelpers.buildInputData(true, true, true, true);
    let req = {body: inputData};
    let sendGridParsedData = sendgrid.parseData(req);
    let actual = {
        personalizations: [{
            to: [{
                "email": "smtest1@mailinator.com",
                "name": "smtest1"
            }, {"email": "smtest2@mailinator.com", "name": "smtest2"}], subject: 'Here you go to test the api'
        }],
        from:
            {
                email:
                    'postmaster@sandboxd29c7f706c634afa8a93d5b5350a7f0b.mailgun.org',
                name: 'Mailgun Sandbox'
            },
        content: [{type: 'text/html', value: '<b>Bold</b> Email html'}]
    };
    expect(sendGridParsedData).toMatchObject(actual);
});