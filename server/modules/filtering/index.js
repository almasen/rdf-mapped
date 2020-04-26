const filterAndSortByTitle = (courses) => {
    const uniqueCourses = new Map();
    courses.forEach(e => {
        uniqueCourses.set(e.title, e);
    });
    return [...uniqueCourses.values()].sort((a, b) => a.title.localeCompare(b.title));
};

const groupByParent = (records, parentIdName) => {
    const recordsMap = new Map();
    const sortedObject = {};
    records.forEach(e => {
        const parentId = e[parentIdName];
        let record = [];
        if (!recordsMap.has(parentId)) {
            record = [];
        } else {
            record = recordsMap.get(parentId);
        }
        record.push(e);
        recordsMap.set(parentId, record);
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
