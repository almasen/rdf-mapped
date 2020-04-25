const videoRepo = require("../../repositories/video");
const log = require("../../util/log");
const filtering = require("../filtering");
/**
 * Fetch similar video records by provided video and video-phase
 * records. If the provided video has multiple phases, one is picked
 * to avoid duplicate results.
 * Returns an array of video records with a default maximum size of 5.
 * @param {Object} video
 * @param {Number} [maximum=5] default is 5
 * @return {Array} similar video records
 */
const fetchSimilarVideoRecords = async (video, maximum) => {
    log.info("Video %s: Fetching similar videos", video.id);

    const findWithPhaseResult = await videoRepo.findByFilters({
        capabilityId: video.capabilityId,
        categoryId: video.categoryId,
        competencyId: video.competencyId,
        // if a video has multiple phases, one of them is picked for search
        phaseId: video.phases[0],
    });
    const findRecords = findWithPhaseResult.rows;

    // TODO: fetch more

    const filteredRecords = findRecords.filter(e => e.id !== video.id);

    log.info("Video %s: Found %s similar video(s), returning %s",
        video.id, filteredRecords.length,
        ((filteredRecords.length > 5) ? (maximum ? maximum : 5) : filteredRecords.length));

    // return maximum 5 by default
    return filteredRecords.slice(0, (maximum ? maximum : 5));
};

/**
 * Fetches all info related to video and resolves
 * all identifiers to values in the database.
 * Returns resolved video object.
 * @param {Number} videoId
 * @return {Object} video
 */
const fetchAndResolveVideo = async (videoId) => {
    log.debug("Video %s: Fetching all info", videoId);
    const findResult = await videoRepo.findByIdWithFullInfo(videoId);
    if (findResult.rows.length < 1) {
        throw new Error(`No video found by id '${videoId}'`);
    }
    log.info("Video %s: Fetched all info", videoId);
    return findResult.rows[0];
};

const fetchByFilters = async (filters) => {
    const findResult = await videoRepo.findByFiltersAndKeywordJoint({
        filters: {
            capabilityId: filters.capability ? parseInt(filters.capability) : -1,
            categoryId: filters.category ? parseInt(filters.category) : -1,
            competencyId: filters.competency ? parseInt(filters.competency) : -1,
            phaseId: filters.phase ? parseInt(filters.phase) : -1,
        },
        keyword: filters.keyword ? filters.keyword : '',
    });
    log.info("Fetched %s videos with %s filters", findResult.rows.length, JSON.stringify(filters));
    const filteredAndSorted = filtering.filterAndSortByTitle(findResult.rows);
    log.info("Removed %s duplicate titles, returning %s", findResult.rows.length - filteredAndSorted.length, filteredAndSorted.length);
    return filteredAndSorted;
};

const fetchAll = async () => {
    return (await fetchByFilters({}));
};

const fetchAllWithUniqueTitles = async () => {
    const allVideos = await fetchByFilters({});
    return filtering.filterAndSortByTitle(allVideos);
};

module.exports = {
    fetchSimilarVideoRecords,
    fetchAndResolveVideo,
    fetchByFilters,
    fetchAll,
    fetchAllWithUniqueTitles,
};
