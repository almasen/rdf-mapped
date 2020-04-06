const videoRepo = require("../../repositories/video");
const videoPhaseRepo = require("../../repositories/video/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const log = require("../../util/log");
const phaseService = require("../phase");

/**
 * Get a video object
 * @param {Number} videoId
 */
const getVideo = async (videoId) => {
    log.info("Getting log by id %s", videoId);
    const videoResult = await videoRepo.findById(videoId);
    const videoRecord = videoResult.rows[0];
    const videoPhaseResult = await videoPhaseRepo.findAllByVideoId(videoId);
    const videoPhaseRecords = videoPhaseResult.rows;

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

module.exports = {
    getVideo,
};
