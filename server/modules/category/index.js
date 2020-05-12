const categoryRepo = require("../../repositories/category");
const cache = require("../cache");

const fetchAll = async () => {
    if (cache.has("categories")) {
        return cache.get("categories");
    } else {
        const findResult = await categoryRepo.findAll();
        cache.set("categories", findResult.rows);
        return findResult.rows;
    }
};

const fetchByKeyword = async (keyword) => {
    if (cache.has("categories")) {
        const cachedVal = cache.get("categories");
        const regex = RegExp(keyword ? keyword : '', 'i');
        const matching = [];
        cachedVal.forEach(e => {
            if (regex.test(e.title)) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await categoryRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

const fetchAllByParent = async (parentId) => {
    if (cache.has("categories")) {
        const cachedVal = cache.get("categories");
        const matching = [];
        cachedVal.forEach(e => {
            if (e.parentId === parentId) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await categoryRepo.findAllByParent(parentId);
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchAllByParent,
};
