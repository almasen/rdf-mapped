/**
 * @module course
 */
const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const log = require("../../util/log");
const filtering = require("../filtering");
const cache = require("../cache");
const _ = require('lodash');

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
    log.info("Course %s: Fetching all info", courseId);
    if (cache.has(`course-${courseId}`)) {
        log.info("Course %s: Fetched all info from CACHE", courseId);
        return cache.get(`course-${courseId}`);
    } else {
        throw new Error(`No course found by id '${courseId}'`);
    }
};

/**
 * Fetch courses based on input filters.
 * Fetches from cache if possible
 * @param {Object} filters
 * @return {Array} matching course objects
 */
const fetchByFilters = async (filters) => {
    if (cache.has("courses")) {
        const cachedVal = cache.get("courses");
        const matching = [];
        const safeKey = _.escapeRegExp(filters.keyword);
        const regex = RegExp(safeKey ? safeKey : '', 'i');
        cachedVal.forEach(e => {
            if (
                (
                    !filters.capability ||
                    parseInt(filters.capability, 10) === -1 ||
                    e.capabilityId === parseInt(filters.capability, 10)
                ) &&
                (
                    !filters.category ||
                    parseInt(filters.category, 10) === -1 ||
                    e.categoryId === parseInt(filters.category, 10)
                ) &&
                (
                    !filters.competency ||
                    parseInt(filters.competency, 10) === -1 ||
                    e.competencyId === parseInt(filters.competency, 10)
                ) &&
                (
                    !filters.phase ||
                    parseInt(filters.phase, 10) === -1 ||
                    e.phases.includes(parseInt(filters.phase, 10))
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
                capabilityId: filters.capability ? parseInt(filters.capability, 10) : -1,
                categoryId: filters.category ? parseInt(filters.category, 10) : -1,
                competencyId: filters.competency ? parseInt(filters.competency, 10) : -1,
                phaseId: filters.phase ? parseInt(filters.phase, 10) : -1,
            },
            keyword: filters.keyword ? filters.keyword : '',
        });
        log.info("Fetched %s courses with %s filters from DB", findResult.rows.length, JSON.stringify(filters));
        return findResult.rows;
    }
};

/**
 * Fetch call courses.
 * Fetches from cache if possible, otherwise
 * fetches from database and caches values
 * for future use.
 */
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

/**
 * Fetch all courses that have unique titles.
 * Fetches all courses then filters and sorts
 * by the titles.
 * @return {Array} courses
 */
const fetchAllWithUniqueTitles = async () => {
    const allCourses = await fetchAll();
    return filtering.filterAndSortByTitle(allCourses);
};

/**
 * Add a new course: insert new course object to the database,
 * and immediately attempt to update the cache with the new object.
 * The course object is only cached if it can successfully be updated
 * from the LinkedIn Learning API.
 * @param {Object} course
 */
const addNewCourse = async (course) => {
    const insertionResult = await courseRepo.insert({
        title: course.title,
        hyperlink: course.hyperlink,
        capabilityId: parseInt(course.capability, 10),
        categoryId: parseInt(course.category, 10),
        competencyId: parseInt(course.competency, 10),
        urn: course.urn,
    });
    const courseId = insertionResult.rows[0].id;
    if (Array.isArray(course.phases)) {
        for await (const phase of course.phases) {
            await coursePhaseRepo.insert({
                courseId,
                phaseId: parseInt(phase, 10),
            });
        }
    } else {
        await coursePhaseRepo.insert({
            courseId,
            phaseId: parseInt(course.phases, 10),
        });
    }
    log.info("Course %d: Successfully inserted new record to database", courseId);
    log.info("Course %d: Caching new course...", courseId);
    const findResult = await courseRepo.findByIdWithFullInfo(courseId);
    const temp = findResult.rows[0];
    cache.set(`course-${courseId}`, temp);
    await cache.updateFromAPI(`course-${courseId}`);
    log.info("Course %d: Cache updated with new course.", courseId);
    return courseId;
};

/**
 * Update a course: update a stored course object in the database,
 * and immediately attempt to update the cache with the object.
 * The course object is only cached if it can successfully be updated
 * from the LinkedIn Learning API.
 * @param {Object} course
 */
const updateCourse = async (course) => {
    const courseId = parseInt(course.id, 10);
    await courseRepo.update({
        title: course.title,
        hyperlink: course.hyperlink,
        capabilityId: parseInt(course.capability, 10),
        categoryId: parseInt(course.category, 10),
        competencyId: parseInt(course.competency, 10),
        urn: course.urn,
        id: courseId,
    });
    await coursePhaseRepo.removeByCourseId(courseId);
    if (Array.isArray(course.phases)) {
        for await (const phase of course.phases) {
            await coursePhaseRepo.insert({
                courseId,
                phaseId: parseInt(phase, 10),
            });
        }
    } else {
        await coursePhaseRepo.insert({
            courseId,
            phaseId: parseInt(course.phases, 10),
        });
    }
    log.info("Course %d: Successfully updated record in database", courseId);
    log.info("Course %d: Caching updated course...", courseId);
    const findResult = await courseRepo.findByIdWithFullInfo(courseId);
    const temp = findResult.rows[0];
    const coursesArray = cache.get("courses");
    const index = coursesArray.findIndex((e) => {
        return e.id === courseId;
    });
    coursesArray[index] = temp;
    cache.set(`course-${courseId}`, temp);
    cache.set("courses", coursesArray);
    log.info("Course %d: Cache updated with updated course.", courseId);
};

/**
 * Delete a course from the database and efficiently remove it
 * from the cache so full flushing of cache can be avoided.
 * @param {Number} id
 */
const deleteCourse = async (id) => {
    log.info("Course %d: Deleting course with all details...", id);
    await courseRepo.removeById(id);
    await coursePhaseRepo.removeByCourseId(id);
    log.info("Course %d: Deleting course from cache...", id);
    cache.del(`course-${id}`);
    const coursesArray = cache.get("courses");
    const index = coursesArray.findIndex((e) => {
        return e.id === parseInt(id, 10);
    });
    coursesArray.splice(index, 1);
    cache.set("courses", coursesArray);
    log.info("Course %d: Deleted course from cache...", id);
    log.info("Course %d: Deleted course with all details...", id);
};

module.exports = {
    fetchSimilarCourseRecords,
    fetchAndResolveCourse,
    fetchByFilters,
    fetchAll,
    fetchAllWithUniqueTitles,
    addNewCourse,
    updateCourse,
    deleteCourse,
};
