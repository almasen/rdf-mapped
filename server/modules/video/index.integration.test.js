const videoRepo = require("../../repositories/video");
const videoPhaseRepo = require("../../repositories/video/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const phaseRepo = require("../../repositories/phase");
const videoService = require("./");

const testHelpers = require("../../test/helpers");

let video1, video2, video3, capability1, category1, competency1, capability2, category2, competency2, phase1, phase2;

beforeEach(() => {
    video1 = testHelpers.getVideo1();
    video2 = testHelpers.getVideo2();
    video3 = testHelpers.getVideo3();
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

test('getting a video object works', async () => {
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

    video1.capabilityId = capInsertRecord.id;
    video1.categoryId = catInsertRecord.id;
    video1.competencyId = compInsertRecord.id;

    video2.capabilityId = capInsertRecord.id;
    video2.categoryId = catInsertRecord.id;
    video2.competencyId = compInsertRecord.id;

    video3.capabilityId = capInsertRecord2.id;
    video3.categoryId = catInsertRecord2.id;
    video3.competencyId = compInsertRecord2.id;

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

    const insertResult2 = await videoRepo.insert(video2);
    const insertRecord2 = insertResult2.rows[0];

    expect(insertRecord2.title).toStrictEqual(video2.title);
    expect(insertRecord2.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord2.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord2.competencyId).toStrictEqual(compInsertRecord.id);

    const videoId2 = insertRecord2.id;

    const insertResult3 = await videoRepo.insert(video3);
    const insertRecord3 = insertResult3.rows[0];

    expect(insertRecord3.title).toStrictEqual(video3.title);
    expect(insertRecord3.capabilityId).toStrictEqual(capInsertRecord2.id);
    expect(insertRecord3.categoryId).toStrictEqual(catInsertRecord2.id);
    expect(insertRecord3.competencyId).toStrictEqual(compInsertRecord2.id);

    const videoId3 = insertRecord3.id;

    // insert video-phase links
    const videoPhaseInsertResult11 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId1,
    });
    const videoPhaseInsertResult12 = await videoPhaseRepo.insert({
        videoId: videoId,
        phaseId: phaseId2,
    });
    const videoPhaseInsertResult21 = await videoPhaseRepo.insert({
        videoId: videoId2,
        phaseId: phaseId1,
    });
    const videoPhaseInsertResult22 = await videoPhaseRepo.insert({
        videoId: videoId2,
        phaseId: phaseId2,
    });
    const videoPhaseInsertResult31 = await videoPhaseRepo.insert({
        videoId: videoId3,
        phaseId: phaseId1,
    });
    const videoPhaseInsertResult32 = await videoPhaseRepo.insert({
        videoId: videoId3,
        phaseId: phaseId2,
    });

    // const findResult = await videoPhaseRepo.findAllByVideoId(videoId);
    // const findRecords = findResult.rows;

    // expect(findRecords.length).toStrictEqual(2);
    // expect(findRecords[0].videoId).toStrictEqual(videoId);
    // expect(findRecords[0].phaseId).toStrictEqual(phaseId1);
    // expect(findRecords[1].videoId).toStrictEqual(videoId);
    // expect(findRecords[1].phaseId).toStrictEqual(phaseId2);

    // const findResultByPhase1 = await videoPhaseRepo.findAllByPhaseId(phaseId1);
    // const findResultByPhase2 = await videoPhaseRepo.findAllByPhaseId(phaseId2);
    // const findRecordsByPhase1 = findResultByPhase1.rows;
    // const findRecordsByPhase2 = findResultByPhase2.rows;

    // expect(findRecordsByPhase1.length).toStrictEqual(1);
    // expect(findRecordsByPhase2.length).toStrictEqual(1);
    // expect(findRecordsByPhase1[0].videoId).toStrictEqual(videoId);
    // expect(findRecordsByPhase2[0].videoId).toStrictEqual(videoId);

    // const findResultByPairIds = await videoPhaseRepo.find(videoId, phaseId1);
    // expect(findResultByPairIds.rows.length).toStrictEqual(1);


    const getVideoResult = await videoService.fetchAndResolveVideo(videoId);

    expect(getVideoResult.title).toStrictEqual(video1.title);
    expect(getVideoResult.hyperlink).toStrictEqual(video1.hyperlink);
    expect(getVideoResult.capability).toStrictEqual(capability1.title);
    expect(getVideoResult.category).toStrictEqual(category1.title);
    expect(getVideoResult.competency).toStrictEqual(competency1.title);
    expect(getVideoResult.phases[0]).toStrictEqual(phase1.title);
    expect(getVideoResult.phases[1]).toStrictEqual(phase2.title);

    const getVideoResult2 = await videoService.fetchAndResolveVideo(videoId2);

    expect(getVideoResult2.title).toStrictEqual(video2.title);
    expect(getVideoResult2.hyperlink).toStrictEqual(video2.hyperlink);
    expect(getVideoResult2.capability).toStrictEqual(capability1.title);
    expect(getVideoResult2.category).toStrictEqual(category1.title);
    expect(getVideoResult2.competency).toStrictEqual(competency1.title);
    expect(getVideoResult2.phases[0]).toStrictEqual(phase1.title);
    expect(getVideoResult2.phases[1]).toStrictEqual(phase2.title);

    const getVideoResult3 = await videoService.fetchAndResolveVideo(videoId3);

    expect(getVideoResult3.title).toStrictEqual(video3.title);
    expect(getVideoResult3.hyperlink).toStrictEqual(video3.hyperlink);
    expect(getVideoResult3.capability).toStrictEqual(capability2.title);
    expect(getVideoResult3.category).toStrictEqual(category2.title);
    expect(getVideoResult3.competency).toStrictEqual(competency2.title);
    expect(getVideoResult3.phases[0]).toStrictEqual(phase1.title);
    expect(getVideoResult3.phases[1]).toStrictEqual(phase2.title);


    // == FETCHING SIMILAR == //

    const fetchSimilarResult1 = await videoService.fetchSimilarVideoRecordsById(videoId);
    const fetchSimilarRecords1 = fetchSimilarResult1;
    expect(fetchSimilarRecords1.length).toStrictEqual(1);
    expect(fetchSimilarRecords1[0].title).toStrictEqual(video2.title);
    const fetchSimilarResult2 = await videoService.fetchSimilarVideoRecordsById(videoId2);
    const fetchSimilarRecords2 = fetchSimilarResult2;
    expect(fetchSimilarRecords2.length).toStrictEqual(1);
    expect(fetchSimilarRecords2[0].title).toStrictEqual(video1.title);
    const fetchSimilarResult3 = await videoService.fetchSimilarVideoRecordsById(videoId3);
    const fetchSimilarRecords3 = fetchSimilarResult3;
    expect(fetchSimilarRecords3.length).toStrictEqual(0);
});