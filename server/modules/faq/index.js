const faqRepo = require("../../repositories/faq");

const fetchAll = async () => {
    const findResult = await faqRepo.findAll();
    return findResult.rows;
};

const fetchByKeyword = async (keyword) => {
    const findResult = await faqRepo.findByKeyword(keyword);
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
};
