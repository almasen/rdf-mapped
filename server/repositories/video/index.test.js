const videoRepo = require("./");
const capabilityRepo = require("../capability");
const categoryRepo = require("../category");
const competencyRepo = require("../competency");
const phaseRepo = require("../phase");
const videoPhaseRepo = require("./phase");

const testHelpers = require("../../test/helpers");

let video1, video2, capability1, capability2, category1, category2, competency1, competency2, phase1, phase2;

beforeEach(() => {
    video1 = testHelpers.getVideo1();
    video2 = testHelpers.getVideo2();
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);


    const findResult = await videoRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(video1.title);
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;
    video2.capabilityId = capInsertRecord2.id;
    video2.categoryId = catInsertRecord2.id;
    video2.competencyId = compInsertRecord2.id;

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    const insertResult2 = await videoRepo.insert(video2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);
    expect(insertRecord2.title).toStrictEqual(video2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord2.id);

    const searchResult = await videoRepo.searchByKeyword("");
    expect(searchResult.rows.length).toBe(2);
    expect(searchResult.rows[0].title).toBe(video1.title);
    expect(searchResult.rows[1].title).toBe(video2.title);

    const searchResult2 = await videoRepo.searchByKeyword("Research");
    expect(searchResult2.rows.length).toBe(2);
    expect(searchResult2.rows[0].title).toBe(video1.title);
    expect(searchResult2.rows[1].title).toBe(video2.title);

    const searchResult3 = await videoRepo.searchByKeyword("Development");
    expect(searchResult3.rows.length).toBe(1);
    expect(searchResult3.rows[0].title).toBe(video1.title);
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);


    const findResult = await videoRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(video1.title);

    findRecord.title = "new title";
    findRecord.hyperlink = "new hyperlink";

    const updateResult = await videoRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");
    expect(updateRecord.hyperlink).toStrictEqual("new hyperlink");

    const findResult2 = await videoRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
    expect(findRecord2.hyperlink).toStrictEqual("new hyperlink");
    // category unchanged
    expect(findRecord2.categoryId).toStrictEqual(insertRecord.categoryId);
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;
    video2.capabilityId = capInsertRecord2.id;
    video2.categoryId = catInsertRecord2.id;
    video2.competencyId = compInsertRecord2.id;

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    const insertResult2 = await videoRepo.insert(video2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);
    expect(insertRecord2.title).toStrictEqual(video2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord2.id);

    const videoId = insertRecord.id;
    const videoId2 = insertRecord2.id;
    // insert video-phase links
    const videoPhaseInsertResult1 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId1,
    });
    const videoPhaseInsertResult12 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId2,
    });
    const videoPhaseInsertResult2 = await videoPhaseRepo.insert({
        videoId: videoId2,
        phaseId: phaseId2,
    });


    const findResult = await videoRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(video1.title);


    const findByFiltersResult1 = await videoRepo.findByFilters({
        capabilityId: -1,
        categoryId: -1,
        competencyId: -1,
        phaseId: -1,
    });
    expect(findByFiltersResult1.rows.length).toBe(3);
    const findByFiltersResult2 = await videoRepo.findByFilters({
        capabilityId: video1.capabilityId,
        categoryId: video1.categoryId,
        competencyId: -1,
        phaseId: -1,
    });
    expect(findByFiltersResult2.rows.length).toBe(2);
    expect(findByFiltersResult2.rows[0].title).toBe(video1.title);
    expect(findByFiltersResult2.rows[1].title).toBe(video1.title);
    const findByFiltersResult22 = await videoRepo.findByFilters({
        capabilityId: video1.capabilityId,
        categoryId: video1.categoryId,
        competencyId: -1,
        phaseId: phaseId1,
    });
    expect(findByFiltersResult22.rows.length).toBe(1);
    expect(findByFiltersResult22.rows[0].title).toBe(video1.title);
    const findByFiltersResult3 = await videoRepo.findByFilters({
        capabilityId: video2.capabilityId,
        categoryId: video2.categoryId,
        competencyId: video2.competencyId,
        phaseId: phaseId2,
    });
    expect(findByFiltersResult3.rows.length).toBe(1);
    expect(findByFiltersResult3.rows[0].title).toBe(video2.title);
    const findByFiltersResult4 = await videoRepo.findByFilters({
        capabilityId: video2.capabilityId,
        categoryId: video2.categoryId,
        competencyId: 0,
        phaseId: -1,
    });
    expect(findByFiltersResult4.rows.length).toBe(0);
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;
    video2.capabilityId = capInsertRecord2.id;
    video2.categoryId = catInsertRecord2.id;
    video2.competencyId = compInsertRecord2.id;

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    const insertResult2 = await videoRepo.insert(video2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);
    expect(insertRecord2.title).toStrictEqual(video2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord2.id);

    const videoId = insertRecord.id;
    const videoId2 = insertRecord2.id;
    // insert video-phase links
    const videoPhaseInsertResult1 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId1,
    });
    const videoPhaseInsertResult12 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId2,
    });
    const videoPhaseInsertResult2 = await videoPhaseRepo.insert({
        videoId: videoId2,
        phaseId: phaseId2,
    });


    const findResult = await videoRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(video1.title);


    const findByFiltersResult1 = await videoRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: -1,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Research"
    });
    expect(findByFiltersResult1.rows.length).toBe(3);

    const findByFiltersResult2 = await videoRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: -1,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "ethics"
    });
    expect(findByFiltersResult2.rows.length).toBe(1);

    const findByFiltersResult3 = await videoRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: video1.capabilityId,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Research"
    });
    expect(findByFiltersResult3.rows.length).toBe(2);

    const findByFiltersResult4 = await videoRepo.findByFiltersAndKeyword({
        filters: {
            capabilityId: video2.capabilityId,
            categoryId: -1,
            competencyId: -1,
            phaseId: -1,
        },
        keyword: "Research"
    });
    expect(findByFiltersResult4.rows.length).toBe(1);
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const findResult = await videoRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(video1.title);

    const deletionResult = await videoRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await videoRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

