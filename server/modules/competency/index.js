const competencyRepo = require("../../repositories/competency");
const cache = require("../cache");

const fetchAll = async () => {
    if (cache.has("competencies")) {
        return cachedVal = cache.get("competencies");
    } else {
        const findResult = await competencyRepo.findAll();
        cache.set("competencies", findResult.rows);
        return findResult.rows;
    }
};

const fetchByKeyword = async (keyword) => {
    if (cache.has("competencies")) {
        const cachedVal = cache.get("competencies");
        const regex = RegExp(keyword ? keyword : '', 'i');
        const matching = [];
        cachedVal.forEach(e => {
            if (regex.test(e.title)) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await competencyRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

const fetchAllByParent = async (parentId) => {
    if (cache.has("competencies")) {
        const cachedVal = cache.get("competencies");
        const matching = [];
        cachedVal.forEach(e => {
            if (e.parentId === parentId) {
                matching.push(e);
            }
        });
        return matching;
    }
    const findResult = await competencyRepo.findAllByParent(parentId);
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchAllByParent,
};
