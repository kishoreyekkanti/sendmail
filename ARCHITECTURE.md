Current Architecture
---
* As of now this code base can be deployed as an individual service accepting HTTP requests.
* All the email requests are first routed to SendGrid and if SendGrid fails, then they are routed to Mailgun.
* Axios is the library of choice used to do the HTTP requests
* request_ids are being logged to trace the logs, assuming all the logs go to a centralised place.
* Tests are written with Jest and can be run using `npm test`.
* Production systems can be run via `pm2` so that the process will never be killed.
* `restify` is used as simple webserver to serve all the api requests.
* All logs are written in json format using `Bunyan` with auto rotation. 

Constraints
---
* This is http only service and hence if you are looking for a high volume emails(in the order of hundreds of thousands) 
like marketing campaigns for hundreds of thousands of users, then better to use a completely asynchronous approach than a http one.
* This is created as a stateless service and hence if the process is killed during serving a request, the consumer api wil get a 499 and the data is lost
* No Authentication is provided for the service api
* Batching of emails is not supported
* Load balancing the emails across the two providers is not supported.

Auditing
--
Few things which we ought to log include - 
* Time taken for each http request(includes the email provider api call duration). Helps us to identify which providers are best during high throughput times.
* IPs from which the api calls are being received
* Request ids to track the requests across various services
* Retries in case of api call failures
* How the Service api itself responding and their corresponding status codes
* Usage of centralised logging system to ship the logs to one place.

Most of the above auditing can be done by hooking to the request filter chains. APM tools like Datadog and Newrelic also 
can give us an in depth understanding of the service. 

High Volume Email
---
Email/sms/notifications delivery can be done in various ways based on the use case and volume of events being processed.
At a high level there are two approaches to consider 
* Synchronous - HTTP API calls
* Asynchronous - Queues, Streaming, HTTP Apis which can queue the request etc,. 

Below I'll discuss about pros and cons of the approaches - 

### Synchronous HTTP API calls

A single end point which can wrap multiple service providers and send the email instantaneously.

Pros
* Simple implementation for low volume emails, assuming most of the data understanding can be done via the email providers.

Cons
* Soon the service will become a bottleneck if we need to increase the throughput of the service.
* Consumers of the service need to implement various mechanisms like batching the emails before delivery.
* Soon state maintenance will be a night mare to do link tracking, mail opens, deliveries etc,.
     

### Asynchronous 

We can implement this in two different ways 
* A HTTP Api 
    * which responds to the user immediately queuing the request for further processing
    * which responds immediately but also takes a callback as part of the request, to callback the consumer once the delivery completes.   
    
* A Queue of messages which are consumed by the farm of subscribers at their own pace and updating the corresponding state 
of the email delivery in the required formats.

Queue based approach would be the best one for high volume emails. Cloud services like SQS/Cloud pubsub can provide us 
virtually infinite scale with all the required batching mechanisms and we can autoscale the consumers based on the throughput of the queue.     