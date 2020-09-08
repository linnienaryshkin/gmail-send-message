const { JobAbstract } = require('./job.abstract');

class SendEmailJob extends JobAbstract {
    get queueName() {
        return 'SendEmailJob';
    }
}

exports.sendEmailJob = new SendEmailJob();
