const videoRepo = require("../../repositories/video");
const videoPhaseRepo = require("../../repositories/video/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const log = require("../../util/log");
const phaseService = require("../phase");

/**
 * Fetch the video record and relevant video
 * phase records from the database and return
 * together as a single object.
 * @param {Number} videoId
 * @return {Object} videoRecord & videoPhaseRecords
 */
const fetchVideoAndPhaseRecords = async (videoId) => {
    const videoRecord = await fetchVideoRecord(videoId);
    const videoPhaseRecords = await fetchVideoPhaseRecords(videoId);
    return {
        videoRecord,
        videoPhaseRecords,
    };
};

/**
 * Fetch the video record from the database
 * and return it as an object.
 * @param {Number} videoId
 * @return {Object} videoRecord & videoPhaseRecords
 */
const fetchVideoRecord = async (videoId) => {
    const videoResult = await videoRepo.findById(videoId);
    if (videoResult.rows.length < 1) {
        throw new Error(`No video found by id '${videoId}'`);
    }
    return videoResult.rows[0];
};

/**
 * Fetch the video-phase records related to a videoId
 * from the database and return them as an array.
 * @param {Number} videoId
 * @return {Array} videoPhaseRecords
 */
const fetchVideoPhaseRecords = async (videoId) => {
    const videoPhaseResult = await videoPhaseRepo.findAllByVideoId(videoId);
    if (videoPhaseResult.rows.length < 1) {
        throw new Error(`No phases found by video id '${videoId}'`);
    }
    return videoPhaseResult.rows;
};

/**
 * Resolve a video object by given
 * video record and related video-phase
 * records.
 * @param {Object} videoRecord
 * @param {Array} videoPhaseRecords
 * @return {Object} video
 */
const resolveVideoObject = async (videoRecord, videoPhaseRecords) => {
    log.info("Video %s: Resolving video details", videoRecord.id);

    const video = {
        title: videoRecord.title,
        hyperlink: videoRecord.hyperlink,
    };

    video.capability = (await capabilityRepo.findById(videoRecord.capabilityId)).rows[0].title;
    video.category = (await categoryRepo.findById(videoRecord.categoryId)).rows[0].title;
    video.competency = (await competencyRepo.findById(videoRecord.competencyId)).rows[0].title;
    video.phases = await phaseService.getPhaseArray(videoPhaseRecords);
    log.info("Video object found with title: %s", video.title);
    return video;
};

/**
 * Fetch similar video records by provided video and video-phase
 * records. If the provided video has multiple phases, one is picked
 * to avoid duplicate results.
 * Returns an array of video records with a default maximum size of 5.
 * @param {Object} videoRecord
 * @param {Array} videoPhaseRecords
 * @param {Number} [size=5] default is 5
 */
const fetchSimilarVideoRecords = async (videoRecord, videoPhaseRecords, size) => {
    log.info("Video %s: Fetching similar videos", videoRecord.id);

    const findWithPhaseResult = await videoRepo.findByFilters({
        capabilityId: videoRecord.capabilityId,
        categoryId: videoRecord.categoryId,
        competencyId: videoRecord.competencyId,
        // if a video has multiple phases, one of them is picked for search
        phaseId: videoPhaseRecords[0].id,
    });
    const findRecords = findWithPhaseResult.rows;

    // if (findRecords.length < 5) {
    //     const findWithAnyPhaseResult = await videoRepo.findByFilters({
    //         capabilityId: videoRecord.capabilityId,
    //         categoryId: videoRecord.categoryId,
    //         competencyId: videoRecord.competencyId,
    //         phaseId: -1,
    //     });
    //     findRecords.concat(findWithAnyPhaseResult.rows);
    // }

    // return maximum 5 by default
    return findRecords.slice(0, (size ? size : 5));
};

const fetchAndResolveVideo = async (videoId) => {
    const records = await fetchVideoAndPhaseRecords(videoId);
    return resolveVideoObject(records.videoRecord, records.videoPhaseRecords);
};

module.exports = {
    fetchVideoAndPhaseRecords,
    fetchVideoRecord,
    fetchVideoPhaseRecords,
    resolveVideoObject,
    fetchSimilarVideoRecords,
    fetchAndResolveVideo,
};
