const competencyRepo = require("../../repositories/competency");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// TODO: clear cache if changes to table

const fetchAll = async () => {
    const cachedVal = myCache.get("competencies");
    if (cachedVal) {
        return cachedVal;
    } else {
        const findResult = await competencyRepo.findAll();
        myCache.set("competencies", findResult.rows);
        return findResult.rows;
    }
};

const fetchByKeyword = async (keyword) => {
    const cachedVal = myCache.get("competencies");
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
    const findResult = await competencyRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

const fetchAllByParent = async (parentId) => {
    const cachedVal = myCache.get("competencies");
    if (cachedVal) {
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
