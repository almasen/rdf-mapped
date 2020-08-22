/**
 * @module information
 */
const informationRepository = require("../../repositories/information");
const cache = require("../cache");

/**
 * Updates an information entry that already exists in the database.
 * Upon success, updates the record in the cache too.
 * @param {Object} information a valid information object
 * @return {Object} updated information entry
 */
const updateInformation = async (information) => {
    const updateInformationResult = await informationRepository.update(information);
    const updatedRecord = updateInformationResult.rows[0];
    // if successful, cache it
    cache.set(`information-${information.type}`, updatedRecord.content);
    return updatedRecord;
};

/**
 * Gets content of an information entry matching the input information
 * type. Fetches from cache if possible, otherwise, fetches from
 * database and caches the value for future use.
 * @param {String} type type of information
 * @return {String} content of information entry
 */
const getInformationData = async (type) => {
    const cacheKey = `information-${type}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    } else {
        const informationResult = await informationRepository.findByType(type);
        const informationObject = informationResult.rows[0];
        // if successful, cache it
        cache.set(cacheKey, informationObject.content);
        return informationObject.content;
    }
};

module.exports = {
    getInformationData,
    updateInformation,
};
