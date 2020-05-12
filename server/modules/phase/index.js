const phaseRepo = require("../../repositories/phase");
const cache = require("../cache");

const getPhaseArray = async (phaseRecords) => {
    const phaseArray = [];
    for await (const coursePhase of phaseRecords) {
        const phaseTitle = (await phaseRepo.findById(coursePhase.phaseId)).rows[0].title;
        phaseArray.push(phaseTitle);
    };
    return phaseArray;
};

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
