const informationRepository = require("../../repositories/information");

/**
 * Updates an information entry that already exists in the database.
 * @param {object} information A valid information object
 * Fails if database calls fail.
 */
const updateInformation = async (information) => {
    const updateInformationResult = await informationRepository.update(information);
    return ({
        status: 200,
        message: "Information entry updated successfully",
        data: {information: updateInformationResult.rows[0]},
    });
};

/**
 * Gets data about an information entry that already exists in the database.
 * @param {String} type type of information
 * Fails if database calls fail.
 */
const getInformationData = async (type) => {
    const informationResult = await informationRepository.findByType(type);
    const information = informationResult.rows[0];

    return ({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: {
                ...information,
            },
        },
    });
};

module.exports = {
    getInformationData,
    updateInformation,
};
