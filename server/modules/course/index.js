const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const phaseRepo = require("../../repositories/phase");
const log = require("../../util/log");
const phaseService = require("../phase");

/**
 * Fetch the course record and relevant course
 * phase records from the database and return
 * together as a single object.
 * @param {Number} courseId
 * @return {Object} courseRecord & coursePhaseRecords
 */
const fetchCourseAndPhaseRecords = async (courseId) => {
    const courseRecord = await fetchCourseRecord(courseId);
    const coursePhaseRecords = await fetchCoursePhaseRecords(courseId);
    return {
        courseRecord,
        coursePhaseRecords,
    };
};

/**
 * Fetch the course record from the database
 * and return it as an object.
 * @param {Number} courseId
 * @return {Object} courseRecord & coursePhaseRecords
 */
const fetchCourseRecord = async (courseId) => {
    const courseResult = await courseRepo.findById(courseId);
    if (courseResult.rows.length < 1) {
        throw new Error(`No course found by id '${courseId}'`);
    }
    return courseResult.rows[0];
};

/**
 * Fetch the course-phase records related to a courseId
 * from the database and return them as an array.
 * @param {Number} courseId
 * @return {Array} coursePhaseRecords
 */
const fetchCoursePhaseRecords = async (courseId) => {
    const coursePhaseResult = await coursePhaseRepo.findAllByCourseId(courseId);
    if (coursePhaseResult.rows.length < 1) {
        throw new Error(`No phases found by course id '${courseId}'`);
    }
    return coursePhaseResult.rows;
};

/**
 * Resolve a course object by given
 * course record and related course-phase
 * records.
 * @param {Object} courseRecord
 * @param {Array} coursePhaseRecords
 * @return {Object} course
 */
const resolveCourseObject = async (courseRecord, coursePhaseRecords) => {
    log.debug("Course %s: Resolving course details", courseRecord.id);

    const course = {...courseRecord};

    course.capability = (await capabilityRepo.findById(courseRecord.capabilityId)).rows[0].title;
    course.category = (await categoryRepo.findById(courseRecord.categoryId)).rows[0].title;
    course.competency = (await competencyRepo.findById(courseRecord.competencyId)).rows[0].title;
    course.phases = await phaseService.getPhaseArray(coursePhaseRecords);

    log.debug("Course %s: Object resolved, title: %s", courseRecord.id, course.title);

    return course;
};

/**
 * Resolve a course object by given
 * course record records.
 * @param {Object} courseRecord with phaseId
 * @return {Object} course
 */
const resolveCourseObjectWithIncludedPhase = async (courseRecord) => {
    log.debug("Course %s: Resolving course details", courseRecord.id);

    const course = {...courseRecord};

    course.capability = (await capabilityRepo.findById(courseRecord.capabilityId)).rows[0].title;
    course.category = (await categoryRepo.findById(courseRecord.categoryId)).rows[0].title;
    course.competency = (await competencyRepo.findById(courseRecord.competencyId)).rows[0].title;
    course.phase = (await phaseRepo.findById(courseRecord.phaseId)).rows[0].title;

    log.debug("Course %s: Object resolved, title: %s", courseRecord.id, course.title);

    return course;
};

/**
 * Fetch similar course records by provided course and course-phase
 * records. If the provided course has multiple phases, one is picked
 * to avoid duplicate results.
 * Returns an array of course records with a default maximum size of 5.
 * @param {Object} courseRecord
 * @param {Array} coursePhaseRecords
 * @param {Number} [size=5] default is 5
 * @return {Array} similar course records
 */
const fetchSimilarCourseRecords = async (courseRecord, coursePhaseRecords, size) => {
    log.info("Course %s: Fetching similar courses", courseRecord.id);

    const findWithPhaseResult = await courseRepo.findByFilters({
        capabilityId: courseRecord.capabilityId,
        categoryId: courseRecord.categoryId,
        competencyId: courseRecord.competencyId,
        // if a course has multiple phases, one of them is picked for search
        phaseId: coursePhaseRecords[0].phaseId,
    });
    const findRecords = findWithPhaseResult.rows;

    // if (findRecords.length < 5) {
    //     const findWithAnyPhaseResult = await courseRepo.findByFilters({
    //         capabilityId: courseRecord.capabilityId,
    //         categoryId: courseRecord.categoryId,
    //         competencyId: courseRecord.competencyId,
    //         phaseId: -1,
    //     });
    //     findRecords.concat(findWithAnyPhaseResult.rows);
    // }

    const filteredRecords = findRecords.filter(e => e.id !== courseRecord.id);

    log.info("Course %s: Found %s similar course(s), returning %s",
        courseRecord.id, filteredRecords.length,
        ((filteredRecords.length > 5) ? (size ? size : 5) : filteredRecords.length));

    // return maximum 5 by default
    return filteredRecords.slice(0, (size ? size : 5));
};

/**
 * Fetches all info related to course and resolves
 * all identifiers to values in the database.
 * Returns resolved course object.
 * @param {Number} courseId
 * @return {Object} course
 */
const fetchAndResolveCourse = async (courseId) => {
    const records = await fetchCourseAndPhaseRecords(courseId);
    return resolveCourseObject(records.courseRecord, records.coursePhaseRecords);
};

/**
 * Fetch similar course records by provided course id.
 * If the provided course has multiple phases, one is picked
 * to avoid duplicate results.
 * Returns an array of course records with a default maximum size of 5.
 * @param {Number} courseId
 * @param {Number} [size=5] default is 5
 * @return {Array} similar course records
 */
const fetchSimilarCourseRecordsById = async (courseId, size) => {
    const records = await fetchCourseAndPhaseRecords(courseId);
    return fetchSimilarCourseRecords(records.courseRecord, records.coursePhaseRecords, size);
};

const fetchByFilters = async (filters) => {
    const findResult = await courseRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: filters.capability ? parseInt(filters.capability) : -1,
            categoryId: filters.category ? parseInt(filters.category) : -1,
            competencyId: filters.competency ? parseInt(filters.competency) : -1,
            phaseId: filters.phase ? parseInt(filters.phase) : -1,
        },
        keyword: filters.keyword ? filters.keyword : "",
    });
    log.info("Fetched %s courses with %s filters", findResult.rows.length, filters);
    return findResult.rows;
};

const fetchAndResolveByFilters = async (filters) => {
    const fetchResult = await fetchByFilters(filters);
    const courses = [];
    for await (const courseRecord of fetchResult) {
        const course = await resolveCourseObjectWithIncludedPhase(courseRecord);
        courses.push(course);
    }
    return courses;
};

module.exports = {
    fetchCourseAndPhaseRecords,
    fetchCourseRecord,
    fetchCoursePhaseRecords,
    resolveCourseObject,
    resolveCourseObjectWithIncludedPhase,
    fetchSimilarCourseRecords,
    fetchAndResolveCourse,
    fetchSimilarCourseRecordsById,
    fetchByFilters,
    fetchAndResolveByFilters,
};
