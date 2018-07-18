global._ROOT = process.env.PWD;
const mailgun = require(global._ROOT + '/mail/providers/mailgun');
const specHelpers = require('../../spec_helpers');

test("Should parse request in MailGun format", () => {
    let inputData = specHelpers.buildInputData(true, true, true, true, true);
    let req = {body: inputData};
    let mailgunParsedData = mailgun.parseData(req);
    let actual = {
        "from": "Mailgun Sandbox <postmaster@sandboxd29c7f706c634afa8a93d5b5350a7f0b.mailgun.org>",
        "html": "<b>Bold</b> Email html",
        "subject": "Here you go to test the api",
        "to": "smtest1 <smtest1@mailinator.com>,smtest2 <smtest2@mailinator.com>,",
        "cc": 'smtest3 <smtest3@mailinator.com>,smtest4 <smtest4@mailinator.com>,'
    };
    expect(mailgunParsedData).toMatchObject(actual);
});