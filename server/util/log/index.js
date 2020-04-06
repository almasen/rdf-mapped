/* istanbul ignore file */
require("dotenv").config();
const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern', pattern: '%[ %d %f{2}:%l%]: %m',
            },
        },
        logFile: {
            type: 'file',
            filename: 'log/rdfmapped.log',
        },
    },
    categories: {
        default: {appenders: ['out', 'logFile'], level: 'info', enableCallStack: true},
    },
});

const log = log4js.getLogger();

switch (process.env.NODE_ENV) {
    case "test":
        log.level = "debug";
        break;
    case "development":
        log.level = "debug";
        break;
    default:
        log.level = "info";
}

if (process.env.CI) {
    log.level = "off";
}

log.info("Logging at level: %s", log.level);

module.exports = log;
