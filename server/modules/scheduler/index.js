const schedule = require('node-schedule');
const recache = require("../cache/recache");
const log = require("../../util/log");

const scheduleRecache = () => {
    schedule.scheduleJob({
        hour: 4,
        minute: 30,
        dayOfWeek: 3,
    }, async () => {
        log.info("SCHEDULER: Executing scheduled task 'recacheAll()' at %s...",
            (new Date).toUTCString());
        await recache.recacheAll();
    });
};

const scheduleAllTasks = () => {
    scheduleRecache();
};

module.exports = {
    scheduleAllTasks,
};
