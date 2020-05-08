const capabilityRepo = require("../../repositories/capability");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// TODO: clear cache if changes to table

const fetchAll = async () => {
    const cachedVal = myCache.get("capabilities");
    if (cachedVal) {
        return cachedVal;
    } else {
        const findResult = await capabilityRepo.findAll();
        myCache.set("capabilities", findResult.rows);
        return findResult.rows;
    }
};

const fetchByKeyword = async (keyword) => {
    const cachedVal = myCache.get("capabilities");
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
    const findResult = await capabilityRepo.findByKeyword(keyword ? keyword : '');
    return findResult.rows;
};

module.exports = {
    fetchAll,
    fetchByKeyword,
};
