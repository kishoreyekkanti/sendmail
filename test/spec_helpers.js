exports.buildInputData = function buildInputData(withFrom, withTo, withSubject, withContent, withCC = false, withBcc = false) {
    let data = {
        from: {},
        to: [],
        subject: "",
        content: {}
    };
    if (withFrom) {
        data["from"] = {
            "email": "postmaster@sandboxd29c7f706c634afa8a93d5b5350a7f0b.mailgun.org",
            "name": "Mailgun Sandbox"
        }
    }
    if (withTo) {
        data["to"] = [{"email": "smtest1@mailinator.com", "name": "smtest1"}, {
            "email": "smtest2@mailinator.com",
            "name": "smtest2"
        }];
    }
    if (withCC) {
        data["cc"] = [{"email": "smtest3@mailinator.com", "name": "smtest3"}, {
            "email": "smtest4@mailinator.com",
            "name": "smtest4"
        }];
    }
    if (withBcc) {
        data["bcc"] = [{"email": "smtest5@mailinator.com", "name": "smtest5"}, {
            "email": "smtest4@mailinator.com",
            "name": "smtest4"
        }];
    }
    if (withSubject) {
        data['subject'] = "Here you go to test the api";
    }
    if (withContent) {
        data['content'] = {
            "type": "text/html",
            "value": "<b>Bold</b> Email html"
        }
    }
    return data;
}