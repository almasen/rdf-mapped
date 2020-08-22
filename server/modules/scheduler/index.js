/**
 * @module scheduler
 */
const schedule = require('node-schedule');
const recache = require("../cache/recache");
const config = require("../../config").scheduler;
const log = require("../../util/log");
const downloadService = require("../download");
const adminService = require("../admin");

/**
 * Schedule the 'recacheAll()' task according to the configuration module.
 */
const scheduleRecache = () => {
    schedule.scheduleJob(config.recache, async () => {
        log.info("SCHEDULER: Executing scheduled task 'recacheAll()' at %s...",
            (new Date).toUTCString());
        await recache.recacheAll();
    });
};

/**
 * Schedule the 'deleteExportFiles()' task according to the configuration module.
 */
const scheduleDeleteExportFiles = () => {
    schedule.scheduleJob(config.deleteExports, async () => {
        log.info("SCHEDULER: Executing scheduled task 'deleteExportFiles()' at %s...",
            (new Date).toUTCString());
        downloadService.deleteExportFiles();
    });
};

/**
 * Schedule the 'sendSummary()' task according to the configuration module.
 */
const scheduleWeeklySummary = () => {
    schedule.scheduleJob(config.weeklySummary, async () => {
        log.info("SCHEDULER: Executing scheduled task 'scheduleWeeklySummary()' at %s...",
            (new Date).toUTCString());
        await adminService.sendSummary();
    });
};

/**
 * Schedule all tasks.
 */
const scheduleAllTasks = () => {
    scheduleRecache();
    scheduleDeleteExportFiles();
    scheduleWeeklySummary();
};

module.exports = {
    scheduleAllTasks,
};
