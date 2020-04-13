const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const phaseRepo = require("../../repositories/phase");
const courseService = require("./");

const testHelpers = require("../../test/helpers");

let course1, capability1, category1, competency1, phase1, phase2;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    phase1 = testHelpers.getPhase1();
    phase2 = testHelpers.getPhase2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('getting a course object works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const capInsertRecord = await capInsertResult.rows[0];
    category1.capabilityId = capInsertRecord.id;
    const catInsertResult = await categoryRepo.insert(category1);
    const catInsertRecord = await catInsertResult.rows[0];
    competency1.categoryId = catInsertRecord.id;
    const compInsertResult = await competencyRepo.insert(competency1);
    const compInsertRecord = await compInsertResult.rows[0];

    const phaseInsertResult1 = await phaseRepo.insert(phase1);
    const phaseInsertResult2 = await phaseRepo.insert(phase2);
    const phaseInsertRecord1 = await phaseInsertResult1.rows[0];
    const phaseInsertRecord2 = await phaseInsertResult2.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const phaseId1 = phaseInsertRecord1.id;
    const phaseId2 = phaseInsertRecord2.id;
    // add phases (for ref, this is not used here)
    course1.phases = [phaseId1, phaseId2];

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const courseId = insertRecord.id;

    // insert course-phase links
    const coursePhaseInsertResult1 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult2 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId2,
    });

    const findResult = await coursePhaseRepo.findAllByCourseId(courseId);
    const findRecords = findResult.rows;

    expect(findRecords.length).toStrictEqual(2);
    expect(findRecords[0].courseId).toStrictEqual(courseId);
    expect(findRecords[0].phaseId).toStrictEqual(phaseId1);
    expect(findRecords[1].courseId).toStrictEqual(courseId);
    expect(findRecords[1].phaseId).toStrictEqual(phaseId2);

    const findResultByPhase1 = await coursePhaseRepo.findAllByPhaseId(phaseId1);
    const findResultByPhase2 = await coursePhaseRepo.findAllByPhaseId(phaseId2);
    const findRecordsByPhase1 = findResultByPhase1.rows;
    const findRecordsByPhase2 = findResultByPhase2.rows;

    expect(findRecordsByPhase1.length).toStrictEqual(1);
    expect(findRecordsByPhase2.length).toStrictEqual(1);
    expect(findRecordsByPhase1[0].courseId).toStrictEqual(courseId);
    expect(findRecordsByPhase2[0].courseId).toStrictEqual(courseId);

    const findResultByPairIds = await coursePhaseRepo.find(courseId, phaseId1);
    expect(findResultByPairIds.rows.length).toStrictEqual(1);


    const getCourseResult = await courseService.getCourse(courseId);

    expect(getCourseResult.title).toStrictEqual(course1.title);
    expect(getCourseResult.hyperlink).toStrictEqual(course1.hyperlink);
    expect(getCourseResult.capability).toStrictEqual(capability1.title);
    expect(getCourseResult.category).toStrictEqual(category1.title);
    expect(getCourseResult.competency).toStrictEqual(competency1.title);
    expect(getCourseResult.phases[0]).toStrictEqual(phase1.title);
    expect(getCourseResult.phases[1]).toStrictEqual(phase2.title);
});