const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const log = require("../../util/log");
const phaseService = require("../phase");

/**
 * Add a new course to the database.
 * This should only be called with a new course
 * record and with already existing params for the
 * course. Here is an example:
 <pre>
 {
    title: "Writing a Research Paper",
    hyperlink: "example.com",
    capabilityId: 1,
    categoryId: 1,
    categoryId: 1,
    phases: [4,5],
 }
 </pre>
 * @param {Object} course
 */
const addCourse = async (course) => {
    // TODO:
    await courseRepo.insert(course);
    for (let i = 0; i < course.phases.length; i++) {
        const coursePhase = course.phases[i];
        await coursePhaseRepo.insert(coursePhase);
    }
};

/**
 * Get a course object
 * @param {Number} courseId
 */
const getCourse = async (courseId) => {
    log.info("Getting course by id %s", courseId);
    const courseResult = await courseRepo.findById(courseId);
    if (courseResult.rows.length < 1) {
        throw new Error(`No course found by id '${courseId}'`);
    }

    const courseRecord = courseResult.rows[0];
    const coursePhaseResult = await coursePhaseRepo.findAllByCourseId(courseId);
    const coursePhaseRecords = coursePhaseResult.rows;

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

module.exports = {
    addCourse,
    getCourse,
};
