const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
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
    log.info("Course %s: Resolving course details", courseRecord.id);

    const course = {
        title: courseRecord.title,
        hyperlink: courseRecord.hyperlink,
    };

    course.capability = (await capabilityRepo.findById(courseRecord.capabilityId)).rows[0].title;
    course.category = (await categoryRepo.findById(courseRecord.categoryId)).rows[0].title;
    course.competency = (await competencyRepo.findById(courseRecord.competencyId)).rows[0].title;
    course.phases = await phaseService.getPhaseArray(coursePhaseRecords);
    log.info("Course object found with title: %s", course.title);
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
 */
const fetchSimilarCourseRecords = async (courseRecord, coursePhaseRecords, size) => {
    log.info("Course %s: Fetching similar courses", courseRecord.id);

    const findWithPhaseResult = await courseRepo.findByFilters({
        capabilityId: courseRecord.capabilityId,
        categoryId: courseRecord.categoryId,
        competencyId: courseRecord.competencyId,
        // if a course has multiple phases, one of them is picked for search
        phaseId: coursePhaseRecords[0].id,
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

    // return maximum 5 by default
    return findRecords.slice(0, (size ? size : 5));
};

const fetchAndResolveCourse = async (courseId) => {
    const records = await fetchCourseAndPhaseRecords(courseId);
    return resolveCourseObject(records.courseRecord, records.coursePhaseRecords);
};

module.exports = {
    fetchCourseAndPhaseRecords,
    fetchCourseRecord,
    fetchCoursePhaseRecords,
    resolveCourseObject,
    fetchSimilarCourseRecords,
    fetchAndResolveCourse,
};
