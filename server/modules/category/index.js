/**
 * @module category
 */
const categoryRepo = require("../../repositories/category");
const cache = require("../cache");
const _ = require('lodash');

/**
 * Fetch all categories. If cached,
 * return from cache, otherwise, fetch from
 * database and cache the values.
 * @return {Array} all category objects
 */
const fetchAll = async () => {
    if (cache.has("categories")) {
        return cache.get("categories");
    } else {
        const findResult = await categoryRepo.findAll();
        cache.set("categories", findResult.rows);
        return findResult.rows;
    }
};

/**
 * Fetch categories based on input keyword.
 * If categories are cached, return from cache,
 * otherwise, fetch from database.
 * @param {String} keyword
 * @return {Array} matching category objects
 */
const fetchByKeyword = async (keyword) => {
    if (cache.has("categories")) {
        const cachedVal = cache.get("categories");
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
    const findResult = await categoryRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

/**
 * Fetch all categories based on input parent id.
 * If categories are cached, return from cache,
 * otherwise, fetch from database.
 * A parent of a category refers to the higher level
 * grouping: 'capabilities'.
 * @param {Number} parentId
 * @return {Array} matching category objects
 */
const fetchAllByParent = async (parentId) => {
    if (cache.has("categories")) {
        const cachedVal = cache.get("categories");
        const matching = [];
        cachedVal.forEach(e => {
            if (e.parentId === parentId) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await categoryRepo.findAllByParent(parentId);
    return findResult.rows;
};

/**
 * Fetch a category object by id from database.
 * @param {Number} id
 * @return {Object} category object
 */
const fetchById = async (id) => {
    const findResult = await categoryRepo.findById(id);
    return findResult.rows[0];
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchAllByParent,
    fetchById,
};
