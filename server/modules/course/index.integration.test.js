const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const phaseRepo = require("../../repositories/phase");
const courseService = require("./");

const testHelpers = require("../../test/helpers");

let course1, course2, course3, capability1, category1, competency1, capability2, category2, competency2, phase1, phase2;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    course2 = testHelpers.getCourse2();
    course3 = testHelpers.getCourse3();
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    capability2 = testHelpers.getCapability2();
    category2 = testHelpers.getCategory2();
    competency2 = testHelpers.getCompetency2();
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

    const capInsertResult2 = await capabilityRepo.insert(capability2);
    const capInsertRecord2 = await capInsertResult2.rows[0];
    category2.capabilityId = capInsertRecord2.id;
    const catInsertResult2 = await categoryRepo.insert(category2);
    const catInsertRecord2 = await catInsertResult2.rows[0];
    competency2.categoryId = catInsertRecord2.id;
    const compInsertResult2 = await competencyRepo.insert(competency2);
    const compInsertRecord2 = await compInsertResult2.rows[0];

    const phaseInsertResult1 = await phaseRepo.insert(phase1);
    const phaseInsertResult2 = await phaseRepo.insert(phase2);
    const phaseInsertRecord1 = await phaseInsertResult1.rows[0];
    const phaseInsertRecord2 = await phaseInsertResult2.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    course2.capabilityId = capInsertRecord.id;
    course2.categoryId = catInsertRecord.id;
    course2.competencyId = compInsertRecord.id;

    course3.capabilityId = capInsertRecord2.id;
    course3.categoryId = catInsertRecord2.id;
    course3.competencyId = compInsertRecord2.id;

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

    const insertResult2 = await courseRepo.insert(course2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord2.title).toStrictEqual(course2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord.id);

    const courseId2 = insertRecord2.id;

    const insertResult3 = await courseRepo.insert(course3);
    const insertRecord3 = insertResult3.rows[0];

    expect(insertRecord3.title).toStrictEqual(course3.title);
    expect(insertRecord3.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord3.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord3.competencyId).toStrictEqual(compInsertRecord2.id);

    const courseId3 = insertRecord3.id;

    // insert course-phase links
    const coursePhaseInsertResult11 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult12 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId2,
    });
    const coursePhaseInsertResult21 = await coursePhaseRepo.insert({
        courseId: courseId2,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult22 = await coursePhaseRepo.insert({
        courseId: courseId2,
        phaseId: phaseId2,
    });
    const coursePhaseInsertResult31 = await coursePhaseRepo.insert({
        courseId: courseId3,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult32 = await coursePhaseRepo.insert({
        courseId: courseId3,
        phaseId: phaseId2,
    });

    // const findResult = await coursePhaseRepo.findAllByCourseId(courseId);
    // const findRecords = findResult.rows;

    // expect(findRecords.length).toStrictEqual(2);
    // expect(findRecords[0].courseId).toStrictEqual(courseId);
    // expect(findRecords[0].phaseId).toStrictEqual(phaseId1);
    // expect(findRecords[1].courseId).toStrictEqual(courseId);
    // expect(findRecords[1].phaseId).toStrictEqual(phaseId2);

    // const findResultByPhase1 = await coursePhaseRepo.findAllByPhaseId(phaseId1);
    // const findResultByPhase2 = await coursePhaseRepo.findAllByPhaseId(phaseId2);
    // const findRecordsByPhase1 = findResultByPhase1.rows;
    // const findRecordsByPhase2 = findResultByPhase2.rows;

    // expect(findRecordsByPhase1.length).toStrictEqual(1);
    // expect(findRecordsByPhase2.length).toStrictEqual(1);
    // expect(findRecordsByPhase1[0].courseId).toStrictEqual(courseId);
    // expect(findRecordsByPhase2[0].courseId).toStrictEqual(courseId);

    // const findResultByPairIds = await coursePhaseRepo.find(courseId, phaseId1);
    // expect(findResultByPairIds.rows.length).toStrictEqual(1);


    const getCourseResult = await courseService.fetchAndResolveCourse(courseId);

    expect(getCourseResult.title).toStrictEqual(course1.title);
    expect(getCourseResult.hyperlink).toStrictEqual(course1.hyperlink);
    expect(getCourseResult.capability).toStrictEqual(capability1.title);
    expect(getCourseResult.category).toStrictEqual(category1.title);
    expect(getCourseResult.competency).toStrictEqual(competency1.title);
    expect(getCourseResult.phases[0]).toStrictEqual(phase1.title);
    expect(getCourseResult.phases[1]).toStrictEqual(phase2.title);

    const getCourseResult2 = await courseService.fetchAndResolveCourse(courseId2);

    expect(getCourseResult2.title).toStrictEqual(course2.title);
    expect(getCourseResult2.hyperlink).toStrictEqual(course2.hyperlink);
    expect(getCourseResult2.capability).toStrictEqual(capability1.title);
    expect(getCourseResult2.category).toStrictEqual(category1.title);
    expect(getCourseResult2.competency).toStrictEqual(competency1.title);
    expect(getCourseResult2.phases[0]).toStrictEqual(phase1.title);
    expect(getCourseResult2.phases[1]).toStrictEqual(phase2.title);

    const getCourseResult3 = await courseService.fetchAndResolveCourse(courseId3);

    expect(getCourseResult3.title).toStrictEqual(course3.title);
    expect(getCourseResult3.hyperlink).toStrictEqual(course3.hyperlink);
    expect(getCourseResult3.capability).toStrictEqual(capability2.title);
    expect(getCourseResult3.category).toStrictEqual(category2.title);
    expect(getCourseResult3.competency).toStrictEqual(competency2.title);
    expect(getCourseResult3.phases[0]).toStrictEqual(phase1.title);
    expect(getCourseResult3.phases[1]).toStrictEqual(phase2.title);


    // == FETCHING SIMILAR == //

    const fetchSimilarResult1 = await courseService.fetchSimilarCourseRecordsById(courseId);
    const fetchSimilarRecords1 = fetchSimilarResult1;
    expect(fetchSimilarRecords1.length).toStrictEqual(1);
    expect(fetchSimilarRecords1[0].title).toStrictEqual(course2.title);
    const fetchSimilarResult2 = await courseService.fetchSimilarCourseRecordsById(courseId2);
    const fetchSimilarRecords2 = fetchSimilarResult2;
    expect(fetchSimilarRecords2.length).toStrictEqual(1);
    expect(fetchSimilarRecords2[0].title).toStrictEqual(course1.title);
    const fetchSimilarResult3 = await courseService.fetchSimilarCourseRecordsById(courseId3);
    const fetchSimilarRecords3 = fetchSimilarResult3;
    expect(fetchSimilarRecords3.length).toStrictEqual(0);
});