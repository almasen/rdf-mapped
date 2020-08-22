/**
 * @module faq
 */
const faqRepo = require("../../repositories/faq");
const cache = require("../cache");

/**
 * Fetch all FAQ objects and return them sorted ascending by id.
 * If FAQs are cached, fetch from cache, otherwise fetch from
 * the database and cache them for future use.
 */
const fetchAll = async () => {
    if (cache.has("faqs")) {
        return cache.get("faqs");
    } else {
        const findResult = await faqRepo.findAll();
        const sortedFaqs = findResult.rows.sort((a, b) => a.id - b.id);
        cache.set("faqs", sortedFaqs);
        return sortedFaqs;
    }
};

/**
 * Get an FAQ object record directly from the database.
 * Skips cache check, designed to be used for admin functionality.
 * @param {Number} id
 * @return {Object} faq object
 */
const findById = async (id) => {
    const findResult = await faqRepo.findById(id);
    return findResult.rows[0];
};

/**
 * Fetch FAQs based on input keyword and matching titles.
 * If FAQs are cached, return from cache,
 * otherwise, fetch from database.
 * @param {String} keyword
 * @return {Array} matching FAQ objects
 */
const fetchByKeyword = async (keyword) => {
    if (cache.has("faqs")) {
        const cachedVal = cache.get("faqs");
        const regex = RegExp(keyword ? keyword : '', 'i');
        const matching = [];
        cachedVal.forEach(e => {
            if (regex.test(e.title)) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await faqRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

/**
 * Update an faq object in the database.
 * Flushes the faqs from cache upon a successful
 * update.
 * @param {Object} faq valid faq object
 * @return {Object} updated faq object
 */
const update = async (faq) => {
    const updateResult = await faqRepo.update(faq);
    // flush cached faqs if successful
    cache.del("faqs");
    return updateResult.rows[0];
};

/**
 * Delete an faq object from the database.
 * Flushes the faqs from the cache upon a successful
 * deletion.
 * @param {Number} id of faq object
 */
const remove = async (id) => {
    await faqRepo.removeById(id);
    cache.del("faqs");
};

/**
 * Insert a new faq into the database.
 * Flushes the faqs from the cache upon a successful
 * insertion.
 * @param {String} question
 * @param {String} answer
 * @return {Object} new faq record
 */
const insert = async (question, answer) => {
    const insertionResult = await faqRepo.insert({
        question,
        answer,
    });
    cache.del("faqs");
    return insertionResult.rows[0];
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    update,
    insert,
    findById,
    remove,
};
