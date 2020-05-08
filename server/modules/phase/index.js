const phaseRepo = require("../../repositories/phase");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// TODO: clear cache if changes to table

const getPhaseArray = async (phaseRecords) => {
    const phaseArray = [];
    for await (const coursePhase of phaseRecords) {
        const phaseTitle = (await phaseRepo.findById(coursePhase.phaseId)).rows[0].title;
        phaseArray.push(phaseTitle);
    };
    return phaseArray;
};

const fetchAll = async () => {
    const cachedVal = myCache.get("phases");
    if (cachedVal) {
        return cachedVal;
    } else {
        const findResult = await phaseRepo.findAll();
        myCache.set("phases", findResult.rows);
        return findResult.rows;
    }
};

module.exports = {
    getPhaseArray,
    fetchAll,
};
