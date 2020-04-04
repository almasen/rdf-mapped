const booleanfiltersAllowed = ["women_only", "physical", "photo_id", "address_visible", "add_info"];

/**
 * Gets the where clause from the filters given to be plugged to any db query.
 * filters can either be array of strings placed in filters.booleans or objects
 * example:
{
    booleans: [ 'physical', '!women_only' ],
    availabilityStart: '2020-03-03',
    availabilityEnd: '2020-12-03',
}
 * @param {Object} filters filters to be applied to the events
 * @param {Object} filters.booleans OPTIONAL boolean filters to be applied to the events
 * @param {Object} filters.availabilityStart OPTIONAL start date for the availability of the user
 * @param {Object} filters.availabilityEnd OPTIONAL end date for the availability of the user
 * @return {string} where clause in postgresql format
 * Fails if database calls fail.
 */
const getWhereClause = (filters) => {
    let clause = "";
    const booleanFilters = filters.booleans;
    const availabilityStart = filters.availabilityStart;
    const availabilityEnd = filters.availabilityEnd;
    if (!booleanFilters && !availabilityStart && !availabilityEnd) return clause;
    clause += " where ";
    if (booleanFilters) {
        booleanFilters.forEach(filter => {
            if (filter) {
                if (filter.startsWith("!") && filterIsValid(filter.substring(1))) {
                    clause += filter.substring(1) + " = false ";
                } else if (filterIsValid(filter)) {
                    clause += filter + " = true ";
                } else {
                    throw new Error('One of the filters is invalid');
                }
                clause += "and ";
            }
        });
    }
    if (availabilityStart) clause+= `date >= \'${availabilityStart}\' and `;
    if (availabilityEnd) clause+= `date <= \'${availabilityEnd}\' and `;
    const lastIndex = clause.lastIndexOf("and");
    return clause.substring(0, lastIndex);
};

const filterIsValid = (filter) => {
    return booleanfiltersAllowed.includes(filter);
};

module.exports = {
    getWhereClause,
};
