const informationRepository = require("../../repositories/information");

/**
 * Updates an information entry that already exists in the database.
 * @param {Object} information a valid information object
 * @return {Object} updated information entry
 */
const updateInformation = async (information) => {
    const updateInformationResult = await informationRepository.update(information);
    return updateInformationResult.rows[0];
};

/**
 * Gets data about an information entry that already exists in the database.
 * @param {String} type type of information
 * @return {String} content of information entry
 */
const getInformationData = async (type) => {
    const informationResult = await informationRepository.findByType(type);
    const informationObject = informationResult.rows[0];

    return informationObject.content;
};

module.exports = {
    getInformationData,
    updateInformation,
};
