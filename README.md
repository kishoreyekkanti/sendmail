Send Email
---
Send Email is a simple wrapper service to send emails through SendGrid by default
and fail over to secondary provider MailGun if SendGrid times out or fails for any reason.

Quick Start
---
Entry point is `app.js` and app can be started by passing on mandatory parameters `SEND_GRID_API_KEY` (or) `MAILGUN_USER` AND `MAILGUN_API_KEY`.

Three ways to start the app

```sh
Ex: SEND_GRID_API_KEY=<SEND GRID KEY> node app.js

Ex: MAILGUN_USER=<USER_NAME> MAILGUN_API_KEY=<API_KEY> node app.js

Ex: SEND_GRID_API_KEY=<SEND GRID API KEY> MAILGUN_USER=<USER> MAILGUN_API_KEY=<API_KEY> node app.js   
```

By default service tries to send email via SendGrid and if it fails, then fallbacks to the secondary provider MailGun.

Process Monitoring
---
In production you an use process monitoring libraries like `pm2` to start the app so that it can automatically restart 
after any failures.

```
EX: SEND_GRID_API_KEY=<SEND GRID API KEY> MAILGUN_USER=<USER> MAILGUN_API_KEY=<API_KEY> pm2 start app.js --name "name-your-mail-service" 
```

Logging
---
If this service is used as one of the down stream services in a larger micro service echo system then you can pass 
`corellation ids` to uniquely identify your request. Pass on the correlation ids in request header `X-Request-Id`. If 
this header is not found then the app will auto generate a unique request id for every http call.

Logs are in json format and the library used is [bunyan](https://github.com/trentm/node-bunyan).

API
---
There's only one api which is exposed to send the emails. Below is the curl request for example - 
```curl
curl -X POST \
  http://localhost:3000/mail/send \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"from":{"email":"postmaster@sandboxd29c7f706c634afa8a93d5b5350a7f0b.mailgun.org","name":"Mailgun Sandbox"},
	"to":[{"email":"smtest1@mailinator.com", "name":"smtest1"}, {"email":"smtest2@mailinator.com", "name":"smtest2"}],
	"subject":"Here you go to test the api",
	"content":{
		"type":"text/html",
		"value":"<b>Bold</b> EMail"
	}
}'
``` 

`from`, `to`, `subject` and `content` are the mandatory fields which need to be passed to the api. Other fields which are supported 
include `cc`, `bcc`.

`from` - An object with mandatory field `email` and optional `name`.

`to` - An array of objects with each object having fields `email` (mandatory), `name`(optional)

`cc` & `bcc`  - Very similar requirement as `to`

`subject` - A plain string
 
 `content` - An object with fields `type`(restricted enum with values "text/plain" and "text/html") and `value`.
 
Use the postman collection `sendmail` 

TODO
---
Extend the api to support attachments, inline images, tracking options and templates.

Constraints
---

* This is http only service and hence if you are looking for a high volume emails(in the order of hundreds of thousands) 
like marketing campaigns for hundreds of thousands of users, then better to use a completely asynchronous approach than a http one.
* No Authentication is provided for the service api
* Batching of emails is not supported
* Load balancing the emails across the two providers is not supported.

Contribute
---
You are free to contribute/fork/use the codebase at your will. Tests are written using [Jest](https://jestjs.io/docs/en/manual-mocks). 

```
npm test
```  