/**
 * @module filtering
 */
/**
 * Filter and sort ascending the input records
 * based on their titles.
 * @param {Array} records
 * @return {Array} sorted & filtered records
 */
const filterAndSortByTitle = (records) => {
    const uniqueObjects = new Map();
    records.forEach(e => {
        uniqueObjects.set(e.title, e);
    });
    return [...uniqueObjects.values()].sort((a, b) => a.title.localeCompare(b.title));
};

/**
 * Group all input records based on parent variable name.
 * Returns an object where the object parameters are the
 * different values of the parent variable name.
 * @param {Array} records which have a parent ID
 * @param {String} parentIdName variable name for parent ID
 * @return {Object} grouped records
 */
const groupByParent = (records, parentIdName) => {
    const recordsMap = new Map();
    const sortedObject = {};
    records.forEach(e => {
        const parentId = e[parentIdName];
        let record = [];
        if (!recordsMap.has(parentId)) {
            record = [];
        } else {
            record = recordsMap.get(parentId);
        }
        record.push(e);
        recordsMap.set(parentId, record);
    });
    for (const [key, value] of recordsMap) {
        sortedObject[key] = value;
    }
    return sortedObject;
};

module.exports = {
    filterAndSortByTitle,
    groupByParent,
};
