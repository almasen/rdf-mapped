/**
 * @module cache
 */
const NodeCache = require("node-cache");
const log = require("../../util/log");
const linkedinApi = require("../linkedin_learning");
const fs = require('fs');

/**
 * The main server cache.
 */
const modulesCache = new NodeCache({
    checkperiod: 0,
});

/**
 * Get a cached object.
 * @param {String} key
 * @return {Object} cached object
 */
const get = (key) => {
    return modulesCache.get(key);
};

/**
 * Cache an object.
 * @param {String} key
 * @param {String} value
 */
const set = (key, value) => {
    modulesCache.set(key, value);
};

/**
 * Return true if key exists in cache.
 * @param {String} key
 * @return {Boolean} true if exists
 */
const has = (key) => {
    return modulesCache.has(key);
};

/**
 * Remove an object from the cache.
 * @param {String} key
 */
const del = (key) => {
    modulesCache.del(key);
};

/**
 * Flush the cache.
 */
const flush = () => {
    log.info("About to flush CACHE, current stats: %s", modulesCache.getStats());
    modulesCache.flushAll();
    log.info("Flushed CACHE, stats reset: %s", modulesCache.getStats());
};

/**
 * Log the cache stats.
 */
const logStats = () => {
    log.info("CACHE stats: %s", modulesCache.getStats());
};

/**
 * Update all cached learning objects from LinkedIn Learning API.
 * Log the results and write out failed objects to a separate log file.
 */
const updateAllFromAPI = async () => {
    log.info("Attempting to update CACHE from LinkedIn-L API..");

    const courses = [];
    const videos = [];
    let successCount = 0;
    let errorCount = 0;
    const objectsWithoutURN = {
        courses: [],
        videos: [],
    };
    for await (const key of modulesCache.keys()) {
        // check if object has an LinkedIn Learning API ID
        const val = modulesCache.get(key);
        if (/^urn:li:/.test(val.urn)) {
            const learningObj = await linkedinApi.fetchLearningObject(val.urn);
            if (learningObj) {
                ++successCount;
                // update object fields
                val.title = learningObj.title.value;
                val.hyperlink = learningObj.details.urls.webLaunch;
                val.longDescription = learningObj.details.descriptionIncludingHtml ?
                    learningObj.details.descriptionIncludingHtml.value : null;
                val.shortDescription = learningObj.details.shortDescriptionIncludingHtml ?
                    learningObj.details.shortDescriptionIncludingHtml.value : null;
                val.picture = learningObj.details.images.primary ?
                    learningObj.details.images.primary : null;
                val.length = learningObj.details.timeToComplete ?
                    learningObj.details.timeToComplete.duration : null;
                // store updated object
                modulesCache.set(key, val);
            } else {
                ++errorCount;
            }
            // add object to collections despite update
            if (/^course-/.test(key)) {
                courses.push(modulesCache.get(key));
            } else if (/^video-/.test(key)) {
                videos.push(modulesCache.get(key));
            }
        } else {
            // log discarded object for not having a URN
            if (/^course-/.test(key)) {
                objectsWithoutURN.courses.push(val);
            } else if (/^video-/.test(key)) {
                objectsWithoutURN.videos.push(val);
            }
            modulesCache.del(key);
        }
    }
    // update collections
    modulesCache.set("courses", courses);
    modulesCache.set("videos", videos);
    errorCount === 0 ?
        log.info("CACHE update from LinkedIn-L API finished without errors: %s objects fetched successfully", successCount) :
        log.warn("CACHE update from LinkedIn-L API had at least one error: %s succeeded, %s failed", successCount, errorCount);
    logStats();

    fs.writeFileSync(`./log/objects_without_urn_${(new Date()).toUTCString()}`, JSON.stringify(objectsWithoutURN));
};

/**
 * Update a single cached object from LinkedIn Learning API.
 * @param {String} key
 */
const updateFromAPI = async (key) => {
    log.info("Attempting to update CACHE(%s) from LinkedIn-L API..", key);
    try {
        const val = modulesCache.get(key);
        const learningObj = await linkedinApi.fetchLearningObject(val.urn);
        if (learningObj) {
            // update object fields
            val.title = learningObj.title.value;
            val.hyperlink = learningObj.details.urls.webLaunch;
            val.longDescription = learningObj.details.descriptionIncludingHtml ?
                learningObj.details.descriptionIncludingHtml.value : null;
            val.shortDescription = learningObj.details.shortDescriptionIncludingHtml ?
                learningObj.details.shortDescriptionIncludingHtml.value : null;
            val.picture = learningObj.details.images.primary ?
                learningObj.details.images.primary : null;
            val.length = learningObj.details.timeToComplete ?
                learningObj.details.timeToComplete.duration : null;
            // store updated object
            modulesCache.set(key, val);
            // add object to collections if updated
            if (/^course-/.test(key)) {
                const courses = modulesCache.get("courses");
                courses.push(modulesCache.get(key));
                modulesCache.set("courses", courses);
            } else if (/^video-/.test(key)) {
                const videos = modulesCache.get("videos");
                videos.push(modulesCache.get(key));
                modulesCache.set("videos", videos);
            }
        }
        log.info("Successfully updated CACHE(%s) from LinkedIn-L API..", key);
    } catch (error) {
        log.error("Failed to update CACHE(%s from LinkedIn-L API.., err: " + error.message, key);
    }
};

module.exports = {
    get,
    set,
    has,
    del,
    flush,
    logStats,
    updateAllFromAPI,
    updateFromAPI,
};
