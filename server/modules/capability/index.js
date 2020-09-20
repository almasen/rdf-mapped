/**
 * @module capability
 */
const capabilityRepo = require("../../repositories/capability");
const cache = require("../cache");
const _ = require('lodash');

/**
 * Fetch all capabilities. If cached,
 * return from cache, otherwise, fetch from
 * database and cache the values.
 * @return {Array} all capability objects
 */
const fetchAll = async () => {
    if (cache.has("capabilities")) {
        return cache.get("capabilities");
    } else {
        const findResult = await capabilityRepo.findAll();
        cache.set("capabilities", findResult.rows);
        return findResult.rows;
    }
};

/**
 * Fetch capabilities based on input keyword.
 * If capabilities are cached, return from cache,
 * otherwise, fetch from database.
 * @param {String} keyword
 * @return {Array} matching capability objects
 */
const fetchByKeyword = async (keyword) => {
    if (cache.has("capabilities")) {
        const cachedVal = cache.get("capabilities");
        const safeKey = _.escapeRegExp(keyword);
        const regex = RegExp(safeKey ? safeKey : '', 'i');
        const matching = [];
        cachedVal.forEach(e => {
            if (regex.test(e.title)) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await capabilityRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

/**
 * Fetch a capability object by id from database.
 * @param {Number} id
 * @return {Object} capability object
 */
const fetchById = async (id) => {
    const findResult = await capabilityRepo.findById(id);
    return findResult.rows[0];
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchById,
};
