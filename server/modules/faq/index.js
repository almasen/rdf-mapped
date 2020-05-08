const faqRepo = require("../../repositories/faq");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// TODO: clear cache if changes to table

const fetchAll = async () => {
    const cachedVal = myCache.get("faqs");
    if (cachedVal) {
        return cachedVal;
    } else {
        const findResult = await faqRepo.findAll();
        myCache.set("faqs", findResult.rows);
        return findResult.rows;
    }
};

const fetchByKeyword = async (keyword) => {
    const cachedVal = myCache.get("faqs");
    if (cachedVal) {
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
