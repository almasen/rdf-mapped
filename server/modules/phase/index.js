const phaseRepo = require("../../repositories/phase");

const getPhaseArray = async (phaseRecords) => {
    const phaseArray = [];
    for await (const coursePhase of phaseRecords) {
        const phaseTitle = (await phaseRepo.findById(coursePhase.phaseId)).rows[0].title;
        phaseArray.push(phaseTitle);
    };
    return phaseArray;
};

const fetchAll = async () => {
    const findResult = await phaseRepo.findAll();
    return findResult.rows;
};

module.exports = {
    getPhaseArray,
    fetchAll,
};
