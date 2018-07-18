const Validator = require('jsonschema').Validator;

const mailValidator = new Validator();

const emailFormatSchema = {
    "id": "/EmailFormat",
    "type": "array",
    "minItems": 1,
    "maxItems": 1000,
    "items": {
        "type": "object",
        "properties": {
            "email": {"type": "email", "required": true},
            "name": {"type": "string"},
        }
    }
};

const emailSchema = {
    "type": "object",
    "properties": {
        "from": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "required": true},
                "name": {"type": "string"},
            }
        },
        "to": {"$ref": "/EmailFormat"},
        "cc": {"required": false, "$ref": "/EmailFormat"},
        "bcc": {"required": false, "$ref": "/EmailFormat"},
        "subject": {"type": "string"},
        "content": {
            "type": "object",
            "properties": {
                "type": {"type": "string", "required": true, "enum": ["text/plain", "text/html"]},
                "value": {"type": "string", "required": true},
                "required": true
            }
        }
    },
    "required": ["from", "to", "subject", "content"]
};

mailValidator.addSchema(emailFormatSchema, '/EmailFormat');

class Mail {
    constructor() {

    }

    validate(data) {
        return mailValidator.validate(data, emailSchema)
    }
}

module.exports = Mail;
