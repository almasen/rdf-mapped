const faqRepo = require("../../repositories/faq");
const cache = require("../cache");

const fetchAll = async () => {
    if (cache.has("faqs")) {
        return cache.get("faqs");
    } else {
        const findResult = await faqRepo.findAll();
        cache.set("faqs", findResult.rows);
        return findResult.rows;
    }
};

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

module.exports = {
    fetchAll,
    fetchByKeyword,
};
