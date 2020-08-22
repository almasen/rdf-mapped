/**
 * @module competency
 */
const competencyRepo = require("../../repositories/competency");
const cache = require("../cache");

/**
 * Fetch all competencies. If cached,
 * return from cache, otherwise, fetch from
 * database and cache the values.
 * @return {Array} all competency objects
 */
const fetchAll = async () => {
    if (cache.has("competencies")) {
        return cachedVal = cache.get("competencies");
    } else {
        const findResult = await competencyRepo.findAll();
        cache.set("competencies", findResult.rows);
        return findResult.rows;
    }
};

/**
 * Fetch competencies based on input keyword.
 * If competencies are cached, return from cache,
 * otherwise, fetch from database.
 * @param {String} keyword
 * @return {Array} matching competency objects
 */
const fetchByKeyword = async (keyword) => {
    if (cache.has("competencies")) {
        const cachedVal = cache.get("competencies");
        const regex = RegExp(keyword ? keyword : '', 'i');
        const matching = [];
        cachedVal.forEach(e => {
            if (regex.test(e.title)) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await competencyRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

/**
 * Fetch all competencies based on input parent id.
 * If competencies are cached, return from cache,
 * otherwise, fetch from database.
 * A parent of a competency refers to the higher level
 * grouping: 'categories'.
 * @param {Number} parentId
 * @return {Array} matching competency objects
 */
const fetchAllByParent = async (parentId) => {
    if (cache.has("competencies")) {
        const cachedVal = cache.get("competencies");
        const matching = [];
        cachedVal.forEach(e => {
            if (e.parentId === parentId) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await competencyRepo.findAllByParent(parentId);
    return findResult.rows;
};

/**
 * Fetch a competency object by id from database.
 * @param {Number} id
 * @return {Object} competency object
 */
const fetchById = async (id) => {
    const findResult = await competencyRepo.findById(id);
    return findResult.rows[0];
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchAllByParent,
    fetchById,
};
