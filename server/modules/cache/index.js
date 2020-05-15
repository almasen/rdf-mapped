const NodeCache = require("node-cache");
const log = require("../../util/log");

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

module.exports = {
    get,
    set,
    has,
    flush,
    logStats,
};
