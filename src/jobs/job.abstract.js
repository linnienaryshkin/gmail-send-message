const Bull = require('bull');
const { configService } = require('../config/config.service');

exports.JobAbstract = class JobAbstract {
    #bullInstance = null;

    get queueName() {
        return 'default';
    }

    get instance() {
        if (!this.#bullInstance) {
            this.#bullInstance = new Bull(this.queueName, {
                redis: {
                    port: configService.redisPort,
                    host: configService.redisHost,
                },
                limiter: {
                    max: 1000,
                    duration: 5000,
                },
            });

            this.#bullInstance.on('active', (job) => {
                console.info(`Job ${this.queueName} (${job.id}) start working`);
            });
            this.#bullInstance.on('stalled', (job) => {
                console.info(`Job ${this.queueName} (${job.id}) stalled!`);
            });
            this.#bullInstance.on('completed', (job, result) => {
                console.info(`Job ${this.queueName} (${job.id}) successfully completed with result ${result}`);
            });
            this.#bullInstance.on('cleaned', (job) => {
                console.warn(`Job ${this.queueName} (${job.id}) have been cleaned from the queue`);
            });
            this.#bullInstance.on('removed', (job) => {
                console.warn(`Job ${this.queueName} (${job.id}) successfully removed`);
            });
            this.#bullInstance.on('failed', (job, err) => {
                console.error(`Job ${this.queueName} (${job.id}) failed: ${err.toString()}`);
            });
            this.#bullInstance.on('error', (err) => {
                console.error(`Job ${this.queueName} has error: ${err.toString()}`);
            });
        }

        return this.#bullInstance;
    }

    add(data, { delay = null, important = false } = {}) {
        const options = {};

        if (delay !== null) {
            options.delay = delay;
        }
        if (important === true) {
            options.lifo = important;
        }

        return this.instance.add(data, options);
    }

    register() {
        this.instance.process(this.handler.bind(this));
    }

    async handler(job) {
        console.info(`Undefined ${this.queueName} job handler with data: ${job.data}`);
        return job.data;
    }
};
