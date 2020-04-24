const capabilityRepo = require("../../repositories/capability");

const fetchAll = async () => {
    const findResult = await capabilityRepo.findAll();
    return findResult.rows;
};

const fetchByKeyword = async (keyword) => {
    const findResult = await capabilityRepo.findByKeyword(keyword);
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
};
