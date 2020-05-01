const courseRepo = require("./");
const capabilityRepo = require("../capability");
const categoryRepo = require("../category");
const competencyRepo = require("../competency");
const phaseRepo = require("../phase");
const coursePhaseRepo = require("./phase");

const testHelpers = require("../../test/helpers");

let course1, course2, capability1, capability2, category1, category2, competency1, competency2, phase1, phase2;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    course2 = testHelpers.getCourse2();
    capability1 = testHelpers.getCapability1();
    capability2 = testHelpers.getCapability2();
    category1 = testHelpers.getCategory1();
    category2 = testHelpers.getCategory2();
    competency1 = testHelpers.getCompetency1();
    competency2 = testHelpers.getCompetency2();
    phase1 = testHelpers.getPhase1();
    phase2 = testHelpers.getPhase2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const capInsertRecord = await capInsertResult.rows[0];
    category1.capabilityId = capInsertRecord.id;
    const catInsertResult = await categoryRepo.insert(category1);
    const catInsertRecord = await catInsertResult.rows[0];
    competency1.categoryId = catInsertRecord.id;
    const compInsertResult = await competencyRepo.insert(competency1);
    const compInsertRecord = await compInsertResult.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);


    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);
});

test('inserting and finding with optional filters works (includes phases)', async () => {
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

    const phaseId1 = phaseInsertRecord1.id;
    const phaseId2 = phaseInsertRecord2.id;

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;
    course2.capabilityId = capInsertRecord2.id;
    course2.categoryId = catInsertRecord2.id;
    course2.competencyId = compInsertRecord2.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    const insertResult2 = await courseRepo.insert(course2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);
    expect(insertRecord2.title).toStrictEqual(course2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord2.id);

    const courseId = insertRecord.id;
    const courseId2 = insertRecord2.id;
    // insert course-phase links
    const coursePhaseInsertResult1 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult12 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId2,
    });
    const coursePhaseInsertResult2 = await coursePhaseRepo.insert({
        courseId: courseId2,
        phaseId: phaseId2,
    });


    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);


    const findByFiltersResult1 = await courseRepo.findByFilters({
        capabilityId: -1,
        categoryId: -1,
        competencyId: -1,
        phaseId: -1,
    });
    expect(findByFiltersResult1.rows.length).toBe(3);
    const findByFiltersResult2 = await courseRepo.findByFilters({
        capabilityId: course1.capabilityId,
        categoryId: course1.categoryId,
        competencyId: -1,
        phaseId: -1,
    });
    expect(findByFiltersResult2.rows.length).toBe(2);
    expect(findByFiltersResult2.rows[0].title).toBe(course1.title);
    expect(findByFiltersResult2.rows[1].title).toBe(course1.title);
    const findByFiltersResult22 = await courseRepo.findByFilters({
        capabilityId: course1.capabilityId,
        categoryId: course1.categoryId,
        competencyId: -1,
        phaseId: phaseId1,
    });
    expect(findByFiltersResult22.rows.length).toBe(1);
    expect(findByFiltersResult22.rows[0].title).toBe(course1.title);
    const findByFiltersResult3 = await courseRepo.findByFilters({
        capabilityId: course2.capabilityId,
        categoryId: course2.categoryId,
        competencyId: course2.competencyId,
        phaseId: phaseId2,
    });
    expect(findByFiltersResult3.rows.length).toBe(1);
    expect(findByFiltersResult3.rows[0].title).toBe(course2.title);
    const findByFiltersResult4 = await courseRepo.findByFilters({
        capabilityId: course2.capabilityId,
        categoryId: course2.categoryId,
        competencyId: 0,
        phaseId: -1,
    });
    expect(findByFiltersResult4.rows.length).toBe(0);
});

test('inserting and searching by substring works)', async () => {
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

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;
    course2.capabilityId = capInsertRecord2.id;
    course2.categoryId = catInsertRecord2.id;
    course2.competencyId = compInsertRecord2.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    const insertResult2 = await courseRepo.insert(course2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);
    expect(insertRecord2.title).toStrictEqual(course2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord2.id);

    const searchResult = await courseRepo.findByKeyword("");
    expect(searchResult.rows.length).toBe(2);
    expect(searchResult.rows[0].title).toBe(course1.title);
    expect(searchResult.rows[1].title).toBe(course2.title);

    const searchResult2 = await courseRepo.findByKeyword("Research");
    expect(searchResult2.rows.length).toBe(2);
    expect(searchResult2.rows[0].title).toBe(course1.title);
    expect(searchResult2.rows[1].title).toBe(course2.title);

    const searchResult3 = await courseRepo.findByKeyword("Development");
    expect(searchResult3.rows.length).toBe(1);
    expect(searchResult3.rows[0].title).toBe(course1.title);
});

test('inserting and finding with optional filters and substring works', async () => {
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

    const phaseId1 = phaseInsertRecord1.id;
    const phaseId2 = phaseInsertRecord2.id;

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;
    course2.capabilityId = capInsertRecord2.id;
    course2.categoryId = catInsertRecord2.id;
    course2.competencyId = compInsertRecord2.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    const insertResult2 = await courseRepo.insert(course2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);
    expect(insertRecord2.title).toStrictEqual(course2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord2.id);

    const courseId = insertRecord.id;
    const courseId2 = insertRecord2.id;
    // insert course-phase links
    const coursePhaseInsertResult1 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult12 = await coursePhaseRepo.insert({
        courseId: courseId,
        phaseId: phaseId2,
    });
    const coursePhaseInsertResult2 = await coursePhaseRepo.insert({
        courseId: courseId2,
        phaseId: phaseId2,
    });


    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);


    const findByFiltersResult1 = await courseRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: -1,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Research"
    });
    expect(findByFiltersResult1.rows.length).toBe(3);

    const findByFiltersResult2 = await courseRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: -1,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Paper"
    });
    expect(findByFiltersResult2.rows.length).toBe(1);

    const findByFiltersResult3 = await courseRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: course1.capabilityId,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Research"
    });
    expect(findByFiltersResult3.rows.length).toBe(2);

    const findByFiltersResult4 = await courseRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: course2.capabilityId,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Research"
    });
    expect(findByFiltersResult4.rows.length).toBe(1);
});

test('inserting and updating works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const capInsertRecord = await capInsertResult.rows[0];
    category1.capabilityId = capInsertRecord.id;
    const catInsertResult = await categoryRepo.insert(category1);
    const catInsertRecord = await catInsertResult.rows[0];
    competency1.categoryId = catInsertRecord.id;
    const compInsertResult = await competencyRepo.insert(competency1);
    const compInsertRecord = await compInsertResult.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);


    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);

    findRecord.title = "new title";
    findRecord.hyperlink = "new hyperlink";

    const updateResult = await courseRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");
    expect(updateRecord.hyperlink).toStrictEqual("new hyperlink");

    const findResult2 = await courseRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
    expect(findRecord2.hyperlink).toStrictEqual("new hyperlink");
    // category unchanged
    expect(findRecord2.categoryId).toStrictEqual(insertRecord.categoryId);
});

test('inserting and deleting works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const capInsertRecord = await capInsertResult.rows[0];
    category1.capabilityId = capInsertRecord.id;
    const catInsertResult = await categoryRepo.insert(category1);
    const catInsertRecord = await catInsertResult.rows[0];
    competency1.categoryId = catInsertRecord.id;
    const compInsertResult = await competencyRepo.insert(competency1);
    const compInsertRecord = await compInsertResult.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);

    const deletionResult = await courseRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await courseRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

