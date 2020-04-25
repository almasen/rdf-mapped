const courseRepo = require("../../repositories/course");
const log = require("../../util/log");
const filtering = require("../filtering");
/**
 * Fetch similar course records by provided course and course-phase
 * records. If the provided course has multiple phases, one is picked
 * to avoid duplicate results.
 * Returns an array of course records with a default maximum size of 5.
 * @param {Object} course
 * @param {Number} [maximum=5] default is 5
 * @return {Array} similar course records
 */
const fetchSimilarCourseRecords = async (course, maximum) => {
    log.info("Course %s: Fetching similar courses", course.id);

    const findWithPhaseResult = await courseRepo.findByFilters({
        capabilityId: course.capabilityId,
        categoryId: course.categoryId,
        competencyId: course.competencyId,
        // if a course has multiple phases, one of them is picked for search
        phaseId: course.phases[0],
    });
    const findRecords = findWithPhaseResult.rows;

    // TODO: fetch more

    const filteredRecords = findRecords.filter(e => e.id !== course.id);

    log.info("Course %s: Found %s similar course(s), returning %s",
        course.id, filteredRecords.length,
        ((filteredRecords.length > 5) ? (maximum ? maximum : 5) : filteredRecords.length));

    // return maximum 5 by default
    return filteredRecords.slice(0, (maximum ? maximum : 5));
};

/**
 * Fetches all info related to course and resolves
 * all identifiers to values in the database.
 * Returns resolved course object.
 * @param {Number} courseId
 * @return {Object} course
 */
const fetchAndResolveCourse = async (courseId) => {
    log.debug("Course %s: Fetching all info", courseId);
    const findResult = await courseRepo.findByIdWithFullInfo(courseId);
    if (findResult.rows.length < 1) {
        throw new Error(`No course found by id '${courseId}'`);
    }
    log.info("Course %s: Fetched all info", courseId);
    return findResult.rows[0];
};

const fetchByFilters = async (filters) => {
    const findResult = await courseRepo.findByFiltersAndKeywordJoint({
        filters: {
            capabilityId: filters.capability ? parseInt(filters.capability) : -1,
            categoryId: filters.category ? parseInt(filters.category) : -1,
            competencyId: filters.competency ? parseInt(filters.competency) : -1,
            phaseId: filters.phase ? parseInt(filters.phase) : -1,
        },
        keyword: filters.keyword ? filters.keyword : '',
    });
    log.info("Fetched %s courses with %s filters", findResult.rows.length, JSON.stringify(filters));
    const filteredAndSorted = filtering.filterAndSortByTitle(findResult.rows);
    log.info("Removed %s duplicate titles, returning %s", findResult.rows.length - filteredAndSorted.length, filteredAndSorted.length);
    return filteredAndSorted;
};

const fetchAll = async () => {
    return (await fetchByFilters({}));
};

const fetchAllWithUniqueTitles = async () => {
    const allCourses = await fetchByFilters({});
    return filtering.filterAndSortByTitle(allCourses);
};

module.exports = {
    fetchSimilarCourseRecords,
    fetchAndResolveCourse,
    fetchByFilters,
    fetchAll,
    fetchAllWithUniqueTitles,
};
