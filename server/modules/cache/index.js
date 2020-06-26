const NodeCache = require("node-cache");
const log = require("../../util/log");
const linkedinApi = require("../linkedin_learning");

const modulesCache = new NodeCache({
    checkperiod: 0,
});

const get = (key) => {
    return modulesCache.get(key);
};

const set = (key, value) => {
    modulesCache.set(key, value);
};

const has = (key) => {
    return modulesCache.has(key);
};

const flush = () => {
    log.info("About to flush CACHE, current stats: %s", modulesCache.getStats());
    modulesCache.flushAll();
    log.info("Flushed CACHE, stats reset: %s", modulesCache.getStats());
};

const logStats = () => {
    log.info("CACHE stats: %s", modulesCache.getStats());
};

const updateFromAPI = async () => {
    log.info("Attempting to update CACHE from Linkedin-L API..");

    const courses = [];
    const videos = [];
    let successCount = 0;
    let errorCount = 0;
    for await (const key of modulesCache.keys()) {
        // check if object has an Linkedin Learning API ID
        const val = modulesCache.get(key);
        if (/^urn:li:/.test(val.urn)) {
            const learningObj = await linkedinApi.fetchLearningObject(val.urn);
            if (learningObj) {
                ++successCount;
                // update object fields
                val.title = learningObj.title.value;
                val.hyperlink = learningObj.details.urls.webLaunch;
                val.longDescription = learningObj.details.descriptionIncludingHtml.value;
                val.shortDescription = learningObj.details.shortDescriptionIncludingHtml.value;
                val.picture = learningObj.details.images.primary;
                val.length = Math.ceil(learningObj.details.timeToComplete.duration / 3600);
                // store updated object
                modulesCache.set(key, val);
            } else {
                ++errorCount;
            }
        }
        if (/^course-/.test(key)) {
            courses.push(modulesCache.get(key));
        } else if (/^video-/.test(key)) {
            videos.push(modulesCache.get(key));
        }
    }
    errorCount === 0 ?
        log.info("CACHE update from Linkedin-L API finished without errors: %s objects fetched successfully", successCount) :
        log.warn("CACHE update from Linkedin-L API had at least one error: %s succeeded, %s failed", successCount, errorCount);
};

module.exports = {
    get,
    set,
    has,
    flush,
    logStats,
    updateFromAPI,
};
