const NodeCache = require("node-cache");
const log = require("../../util/log");
const linkedinApi = require("../linkedin_learning");
const fs = require('fs');

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
    const objectsWithoutURN = {
        courses: [],
        videos: [],
    };
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
        log.info("CACHE update from Linkedin-L API finished without errors: %s objects fetched successfully", successCount) :
        log.warn("CACHE update from Linkedin-L API had at least one error: %s succeeded, %s failed", successCount, errorCount);
    logStats();


    fs.writeFileSync(`./log/objects_without_urn_${(new Date()).toUTCString()}`, JSON.stringify(objectsWithoutURN));
};

module.exports = {
    get,
    set,
    has,
    flush,
    logStats,
    updateFromAPI,
};
