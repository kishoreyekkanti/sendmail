var Validator = require('jsonschema').Validator;
var v = new Validator();

// Address, to be embedded on Person
var addressSchema = {
    "id": "/SimpleAddress",
    "type": "object",
    "properties": {
        "lines": {
            "type": "array",
            "items": {"type": "string"}
        },
        "zip": {"type": "string"},
        "city": {"type": "string"},
        "country": {"type": "string"}
    },
    "required": ["country"]
};

// Person
var schema = {
    // "id": "/SimplePerson",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        // "address": {"$ref": "/SimpleAddress"},
        // "votes": {"type": "integer", "minimum": 1},
        "people": {"type": "integer", "minimum": 1},
        "votes": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "properties": {
                    "email": {"type": "string"},
                    "name": {"type": "string"},
                    "required": true
                }
            },
            // "name":{
            //     "type":"string"
            // },
        }
    }
};

var p = {
    "name": "Barack Obama",
    "address": {
        "lines": ["1600 Pennsylvania Avenue Northwest"],
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
    },
    "votes": ["asdfs"]


};

var emailFormatSchema = {
    "id": "/EmailFormat",
    "type": "array",
    "minItems": 1,
    "items": {
        "type": "object",
        "properties": {
            "email": {"type": "string", "required": true},
            "name": {"type": "string"},
        }
    }
};

var emailSchema = {
    "type": "object",
    "properties": {
        "from": {"type": "object"},
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

var e = {
    "from": {"email": "admin@example.com", "name": "Admin"},
    "to": [{"email": "kishore4321@mailinator.com", "name": "kishore4321"}, {
        "email": "kishore532@mailinator.com",
        "name": "kishore532"
    }],
    "subject": "Here you go to test the api",
    "content": {
        "type": "text/plain",
        "value": "Plain Text email"
    }
}

v.addSchema(emailFormatSchema, '/EmailFormat');

console.log(v.validate(e, emailSchema));
