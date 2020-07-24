const schedule = require('node-schedule');
const recache = require("../cache/recache");
const config = require("../../config").scheduler;
const log = require("../../util/log");
const downloadService = require("../download");

const scheduleRecache = () => {
    schedule.scheduleJob(config.recache, async () => {
        log.info("SCHEDULER: Executing scheduled task 'recacheAll()' at %s...",
            (new Date).toUTCString());
        await recache.recacheAll();
    });
};

const scheduleDeleteExportFiles = () => {
    schedule.scheduleJob(config.deleteExports, async () => {
        log.info("SCHEDULER: Executing scheduled task 'deleteExportFiles()' at %s...",
            (new Date).toUTCString());
        downloadService.deleteExportFiles();
    });
};

const scheduleAllTasks = () => {
    scheduleRecache();
    scheduleDeleteExportFiles();
};

module.exports = {
    scheduleAllTasks,
};
