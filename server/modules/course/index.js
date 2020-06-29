const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const log = require("../../util/log");
const filtering = require("../filtering");
const cache = require("../cache");

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
    let findRecords = [];
    if (cache.has("courses")) {
        const cachedVal = cache.get("courses");
        log.info("Course %s: Fetching similar courses from CACHE", course.id);
        const matching = [];
        cachedVal.forEach(e => {
            if (
                (e.capabilityId === course.capabilityId) &&
                (e.categoryId === course.categoryId) &&
                (e.competencyId === course.competencyId) &&
                (e.phases[0] === course.phases[0])
            ) {
                matching.push(e);
            }
        });
        findRecords = matching;
    } else {
        log.info("Course %s: Fetching similar courses from DB", course.id);
        const findWithPhaseResult = await courseRepo.findByFilters({
            capabilityId: course.capabilityId,
            categoryId: course.categoryId,
            competencyId: course.competencyId,
            // if a course has multiple phases, one of them is picked for search
            phaseId: course.phases[0],
        });
        findRecords = findWithPhaseResult.rows;
    }

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
    if (cache.has(`course-${courseId}`)) {
        log.info("Course %s: Fetched all info from CACHE", courseId);
        return cache.get(`course-${courseId}`);
    } else {
        // const findResult = await courseRepo.findByIdWithFullInfo(courseId);
        // if (findResult.rows.length < 1) { // TODO: disabled direct fetching of non-cached courses
        throw new Error(`No course found by id '${courseId}'`);
        // }
        // log.info("Course %s: Fetched all info from DB", courseId);
        // return findResult.rows[0];
    }
};

const fetchByFilters = async (filters) => {
    if (cache.has("courses")) {
        const cachedVal = cache.get("courses");
        const matching = [];
        const regex = RegExp(filters.keyword ? filters.keyword : '', 'i');
        cachedVal.forEach(e => {
            if (
                (
                    !filters.capability ||
                    parseInt(filters.capability) === -1 ||
                    e.capabilityId === parseInt(filters.capability)
                ) &&
                (
                    !filters.category ||
                    parseInt(filters.category) === -1 ||
                    e.categoryId === parseInt(filters.category)
                ) &&
                (
                    !filters.competency ||
                    parseInt(filters.competency) === -1 ||
                    e.competencyId === parseInt(filters.competency)
                ) &&
                (
                    !filters.phase ||
                    parseInt(filters.phase) === -1 ||
                    e.phases.includes(parseInt(filters.phase))
                ) &&
                (
                    regex.test(e.title)
                )
            ) {
                matching.push(e);
            }
        });
        log.info("Fetched %s courses with %s filters from CACHE", matching.length, JSON.stringify(filters));
        return matching;
    } else {
        const findResult = await courseRepo.findByFiltersAndKeywordJoint({
            filters: {
                capabilityId: filters.capability ? parseInt(filters.capability) : -1,
                categoryId: filters.category ? parseInt(filters.category) : -1,
                competencyId: filters.competency ? parseInt(filters.competency) : -1,
                phaseId: filters.phase ? parseInt(filters.phase) : -1,
            },
            keyword: filters.keyword ? filters.keyword : '',
        });
        log.info("Fetched %s courses with %s filters from DB", findResult.rows.length, JSON.stringify(filters));
        return findResult.rows;
    }
};

const fetchAll = async () => {
    if (cache.has("courses")) {
        return cache.get("courses");
    } else {
        const courses = await fetchByFilters({});
        cache.set("courses", courses);
        courses.forEach(e => {
            cache.set(`course-${e.id}`, e);
        });
        return (courses);
    }
};

const fetchAllWithUniqueTitles = async () => {
    const allCourses = await fetchAll();
    return filtering.filterAndSortByTitle(allCourses);
};

/**
 * Add a new course
 * TODO: ADD URN resolving
 * @param {Object} course
 */
const addNewCourse = async (course) => {
    const insertionResult = await courseRepo.insert({
        title: course.title,
        hyperlink: course.hyperlink,
        capabilityId: parseInt(course.capability),
        categoryId: parseInt(course.category),
        competencyId: parseInt(course.competency),
        urn: 'null',
    });
    const courseId = insertionResult.rows[0].id;
    if (Array.isArray(course.phases)) {
        for await (const phase of course.phases) {
            await coursePhaseRepo.insert({
                courseId,
                phaseId: parseInt(phase),
            });
        }
    } else {
        await coursePhaseRepo.insert({
            courseId,
            phaseId: parseInt(course.phases),
        });
    }
    log.info("Course %d: Successfully inserted to database", courseId);
    cache.flush();
};

module.exports = {
    fetchSimilarCourseRecords,
    fetchAndResolveCourse,
    fetchByFilters,
    fetchAll,
    fetchAllWithUniqueTitles,
    addNewCourse,
};
