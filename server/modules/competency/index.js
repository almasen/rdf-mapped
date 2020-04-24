const competencyRepo = require("../../repositories/competency");

const fetchAll = async () => {
    const findResult = await competencyRepo.findAll();
    return findResult.rows;
};

const fetchByKeyword = async (keyword) => {
    const findResult = await competencyRepo.findByKeyword(keyword);
    return findResult.rows;
};

const fetchAllByParent = async (parentId) => {
    const findResult = await competencyRepo.findAllByParent(parentId);
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchAllByParent,
};
