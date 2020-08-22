/**
 * @module recache
 */
const cache = require("../");
const courseService = require("../../course");
const videoService = require("../../video");
const log = require("../../../util/log");

/**
 * Recache all objects: flush the cache and recache
 * all objects having updated all learning objects
 * from LinkedIn Learning API.
 * Used on a scheduled basis to keep content up to date.
 */
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
