const { config } = require('dotenv');

config();

class ConfigService {
    get nodeEnv() {
        return process.env.NODE_ENV;
    }

    get port() {
        return process.env.PORT;
    }

    get redisHost() {
        return process.env.REDIS_HOST;
    }

    get redisPort() {
        return process.env.REDIS_PORT;
    }

    get googleTokenPath() {
        return process.env.GOOGLE_TOKEN_PATH;
    }

    get googleCredentialsPath() {
        return process.env.GOOGLE_CREDENTIALS_PATH;
    }
}

exports.configService = new ConfigService();
