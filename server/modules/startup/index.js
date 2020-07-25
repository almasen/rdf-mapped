const downloadService = require("../download");
const recache = require("../cache/recache");
const scheduler = require("../scheduler");

const initialise = async () => {
    // Schedule recurring tasks
    scheduler.scheduleAllTasks();
    // Update content after start-up
    downloadService.deleteExportFiles();
    await recache.recacheAll();
};

module.exports = {
    initialise,
};
