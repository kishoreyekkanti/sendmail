const Mail = require('../../models/mail');
const mail = new Mail;
const specHelpers = require('../spec_helpers');

test('Throw error if Mandatory fields - from, to, subject, are not provided', () => {
    let data = {};
    let validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(4);
});

test("Field 'from' should have properties 'email' and 'name' ", () => {
    let data = specHelpers.buildInputData(false, true, true, true);
    let validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(1);
    expect(validationResult.errors['0'].property).toEqual('instance.from.email');
});

test("Fields 'To', 'Cc' and 'Bcc' should be an array of objects with properties email and name", () => {
    let data = specHelpers.buildInputData(true, false, true, true);
    data['to'] = [{}];
    data['cc'] = [{"name": "namevalue"}];
    data['bcc'] = [];
    let validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(3);
    expect(validationResult.errors['0'].stack).toEqual('instance.to[0].email is required');
    expect(validationResult.errors['1'].stack).toEqual('instance.cc[0].email is required');
    expect(validationResult.errors['2'].stack).toEqual('instance.bcc does not meet minimum length of 1');
});

test("Fields 'content' should have properties type and value", () => {
    let data = specHelpers.buildInputData(true, true, true, false);
    data["content"] = {};
    let validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(2);
    expect(validationResult.errors[0].stack).toEqual('instance.content.type is required');
    expect(validationResult.errors[1].stack).toEqual('instance.content.value is required');

    data["content"] = {"type": "asf"};
    validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(2);
    expect(validationResult.errors[0].stack).toEqual('instance.content.type is not one of enum values: text/plain,text/html');

    data["content"] = {"type": "text/plain", "value": "Hello blank plain text"};
    validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(0);

    data["content"] = {"type": "text/html", "value": "<b>Bold</b> html text"};
    validationResult = mail.validate(data);
    expect(validationResult.errors.length).toEqual(0);
});

