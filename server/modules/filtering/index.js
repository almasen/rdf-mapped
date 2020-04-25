const filterAndSortByTitle = (courses) => {
    const uniqueCourses = new Map();
    courses.forEach(e => {
        uniqueCourses.set(e.title, e);
    });
    return [...uniqueCourses.values()].sort((a, b) => a.title.localeCompare(b.title));
};

const groupByParent = (records) => {
    const recordsMap = new Map();
    const sortedObject = {};
    records.forEach(e => {
        const capabilityId = e.capabilityId;
        let record = [];
        if (!recordsMap.has(capabilityId)) {
            record = [];
        } else {
            record = recordsMap.get(capabilityId);
        }
        record.push(e);
        recordsMap.set(capabilityId, record);
    });
    for (const [key, value] of recordsMap) {
        sortedObject[key] = value;
    }
    return sortedObject;
};

module.exports = {
    filterAndSortByTitle,
    groupByParent,
};
