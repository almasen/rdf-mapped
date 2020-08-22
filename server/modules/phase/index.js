/**
 * @module phase
 */
const phaseRepo = require("../../repositories/phase");
const cache = require("../cache");

/**
 * Get phase array by concerting phase ids to
 * titles.
 * @param {Array} phaseRecords
 * @return {Array} phase titles
 */
const getPhaseArray = async (phaseRecords) => {
    const phaseArray = [];
    for await (const coursePhase of phaseRecords) {
        const phaseTitle = (await phaseRepo.findById(coursePhase.phaseId)).rows[0].title;
        phaseArray.push(phaseTitle);
    };
    return phaseArray;
};

/**
 * Fetch all phases. If cached,
 * return from cache, otherwise, fetch from
 * database and cache the values.
 * @return {Array} all phase objects
 */
const fetchAll = async () => {
    if (cache.has("phases")) {
        return cache.get("phases");
    } else {
        const findResult = await phaseRepo.findAll();
        cache.set("phases", findResult.rows);
        return findResult.rows;
    }
};

module.exports = {
    getPhaseArray,
    fetchAll,
};
