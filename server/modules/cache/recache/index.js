const cache = require("../");
const courseService = require("../../course");
const videoService = require("../../video");
const log = require("../../../util/log");

const recacheAll = async () => {
    log.info("Attempting to recache all content..");

    try {
        cache.flush();
        await courseService.fetchAll();
        await videoService.fetchAll();
        await cache.updateAllFromAPI();
    } catch (error) {
        log.error("Failed to fetch content on start-up, err: " + error.message);
    }
};

module.exports = {
    recacheAll,
};
