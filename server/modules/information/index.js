const informationRepository = require("../../repositories/information");
const cache = require("../cache");

/**
 * Updates an information entry that already exists in the database.
 * Updates the record in the cache too.
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
 * Gets data about an information entry that already exists in
 * the cache or database. Caches the value if only in DB.
 * Does not validate that DB has the record!
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

        cache.set(cacheKey, informationObject.content);

        return informationObject.content;
    }
};

module.exports = {
    getInformationData,
    updateInformation,
};
