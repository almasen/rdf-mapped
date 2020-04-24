const categoryRepo = require("../../repositories/category");

const fetchAll = async () => {
    const findResult = await categoryRepo.findAll();
    return findResult.rows;
};

const fetchByKeyword = async (keyword) => {
    const findResult = await categoryRepo.findByKeyword(keyword);
    return findResult.rows;
};

const fetchAllByParent = async (parentId) => {
    const findResult = await categoryRepo.findAllByParent(parentId);
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchAllByParent,
};
