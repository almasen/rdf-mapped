const filterAndSortByTitle = (courses) => {
    const uniqueCourses = new Map();
    courses.forEach(e => {
        uniqueCourses.set(e.title, e);
    });
    return [...uniqueCourses.values()].sort((a, b) => a.title.localeCompare(b.title));
};

module.exports = {
    filterAndSortByTitle,
};
