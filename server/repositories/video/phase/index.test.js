const videoPhaseRepo = require("./");
const videoRepo = require("../");
const capabilityRepo = require("../../capability");
const categoryRepo = require("../../category");
const competencyRepo = require("../../competency");
const phaseRepo = require("../../phase");

const testHelpers = require("../../../test/helpers");

let video1; let capability1; let category1; let competency1; let phase1; let phase2;

beforeEach(() => {
    video1 = testHelpers.getVideo1();
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

test('inserting and finding works', async () => {
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    const phaseId1 = phaseInsertRecord1.id;
    const phaseId2 = phaseInsertRecord2.id;
    // add phases (for ref, this is not used here)
    video1.phases = [phaseId1, phaseId2];

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const videoId = insertRecord.id;

    // insert course-phase links
    const coursePhaseInsertResult1 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult2 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId2,
    });

    const findResult = await videoPhaseRepo.findAllByVideoId(videoId);
    const findRecords = findResult.rows;

    expect(findRecords.length).toStrictEqual(2);
    expect(findRecords[0].videoId).toStrictEqual(videoId);
    expect(findRecords[0].phaseId).toStrictEqual(phaseId1);
    expect(findRecords[1].videoId).toStrictEqual(videoId);
    expect(findRecords[1].phaseId).toStrictEqual(phaseId2);

    const findResultByPhase1 = await videoPhaseRepo.findAllByPhaseId(phaseId1);
    const findResultByPhase2 = await videoPhaseRepo.findAllByPhaseId(phaseId2);
    const findRecordsByPhase1 = findResultByPhase1.rows;
    const findRecordsByPhase2 = findResultByPhase2.rows;

    expect(findRecordsByPhase1.length).toStrictEqual(1);
    expect(findRecordsByPhase2.length).toStrictEqual(1);
    expect(findRecordsByPhase1[0].videoId).toStrictEqual(videoId);
    expect(findRecordsByPhase2[0].videoId).toStrictEqual(videoId);

    const findResultByPairIds = await videoPhaseRepo.find(videoId, phaseId1);
    expect(findResultByPairIds.rows.length).toStrictEqual(1);
});

test('inserting and deleting by videoId works', async () => {
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    const phaseId1 = phaseInsertRecord1.id;
    const phaseId2 = phaseInsertRecord2.id;
    // add phases (for ref, this is not used here)
    video1.phases = [phaseId1, phaseId2];

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const videoId = insertRecord.id;

    // insert course-phase links
    const coursePhaseInsertResult1 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult2 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId2,
    });

    const deletionResult = await videoPhaseRepo.removeByVideoId(videoId);
    expect(deletionResult.rows.length).toStrictEqual(2);

    const findResult = await videoPhaseRepo.findAllByVideoId(videoId);
    const findRecords = findResult.rows;

    expect(findRecords.length).toStrictEqual(0);
});

test('inserting and deleting by phaseId works', async () => {
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    const phaseId1 = phaseInsertRecord1.id;
    const phaseId2 = phaseInsertRecord2.id;
    // add phases (for ref, this is not used here)
    video1.phases = [phaseId1, phaseId2];

    const insertResult = await videoRepo.insert(video1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(video1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const videoId = insertRecord.id;

    // insert course-phase links
    const coursePhaseInsertResult1 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId1,
    });
    const coursePhaseInsertResult2 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId2,
    });

    const deletionResult = await videoPhaseRepo.removeByPhaseId(phaseId1);
    expect(deletionResult.rows.length).toStrictEqual(1);

    const findResult = await videoPhaseRepo.findAllByVideoId(videoId);
    const findRecords = findResult.rows;

    expect(findRecords.length).toStrictEqual(1);
    expect(findRecords[0].phaseId).toStrictEqual(phaseId2);
});
