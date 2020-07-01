const capabilityRepo = require("../../repositories/capability");
const cache = require("../cache");

const fetchAll = async () => {
    if (cache.has("capabilities")) {
        return cache.get("capabilities");
    } else {
        const findResult = await capabilityRepo.findAll();
        cache.set("capabilities", findResult.rows);
        return findResult.rows;
    }
};

const fetchByKeyword = async (keyword) => {
    if (cache.has("capabilities")) {
        const cachedVal = cache.get("capabilities");
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

const fetchById = async (id) => {
    const findResult = await capabilityRepo.findById(id);
    return findResult.rows[0];
};

module.exports = {
    fetchAll,
    fetchByKeyword,
    fetchById,
};
