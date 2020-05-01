const informationRepository = require("../../repositories/information");

/**
 * Creates a new information entry to be added to the database if type does not exist
 * else updates the current one.
 * @param {object} information A valid information entry
 * Fails if something goes wrong in db.
 */
const changeInformation = async (information ) => {
    const typeExists = await getInformationData(information.type.toString());
    if (Object.keys(typeExists.data.information).length === 0) {
        return await createNewInformation(information);
    } else {
        return await updateInformation(information);
    }
};

/**
 * Creates a new information entry to be added to the database.
 * @param {object} information A valid information entry of a type that does not exist yet
 * Fails if type already exists
 */
const createNewInformation = async (information) => {
    const informationResult = await informationRepository.insert(information);
    return ({
        status: 200,
        message: "Information entry created successfully",
        data: {information: informationResult.rows[0]},
    });
};

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
    changeInformation,
};
