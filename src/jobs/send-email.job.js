const { JobAbstract } = require('./job.abstract');
const { googleApiService } = require('../google-api/google-api.service');

class SendEmailJob extends JobAbstract {
    get queueName() {
        return 'SendEmailJob';
    }

    async handler({ data: { to, from, subject, message } }) {
        try {
            return await googleApiService.sendMessage({ to, from, subject, message });
        } catch (error) {
            return error;
        }
    }
}

exports.sendEmailJob = new SendEmailJob();
