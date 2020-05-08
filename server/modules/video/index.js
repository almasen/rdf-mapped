const videoRepo = require("../../repositories/video");
const log = require("../../util/log");
const filtering = require("../filtering");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// TODO: clear cache if changes to table

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
    let findRecords = [];
    const cachedVal = myCache.get("videos");
    if (cachedVal) {
        log.info("Video %s: Fetching similar videos from cache", video.id);
        const matching = [];
        cachedVal.forEach(e => {
            if (
                (e.capabilityId === video.capabilityId) &&
                (e.categoryId === video.categoryId) &&
                (e.competencyId === video.competencyId) &&
                (e.phases[0] === video.phases[0])
            ) {
                matching.push(e);
            }
        });
        findRecords = matching;
    } else {
        log.info("Video %s: Fetching similar videos from DB", video.id);
        const findWithPhaseResult = await videoRepo.findByFilters({
            capabilityId: video.capabilityId,
            categoryId: video.categoryId,
            competencyId: video.competencyId,
            // if a video has multiple phases, one of them is picked for search
            phaseId: video.phases[0],
        });
        findRecords = findWithPhaseResult.rows;
    }

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
    const cachedVal = myCache.get(videoId);
    if (cachedVal) {
        log.info("Video %s: Fetched all info from cache", videoId);
        return cachedVal;
    } else {
        const findResult = await videoRepo.findByIdWithFullInfo(videoId);
        if (findResult.rows.length < 1) {
            throw new Error(`No video found by id '${videoId}'`);
        }
        log.info("Video %s: Fetched all info from DB", videoId);
        return findResult.rows[0];
    }
};

const fetchByFilters = async (filters) => {
    const cachedVal = myCache.get("videos");
    if (cachedVal) {
        const matching = [];
        const regex = RegExp(filters.keyword ? filters.keyword : '', 'i');
        cachedVal.forEach(e => {
            if (
                (
                    !filters.capability ||
                    parseInt(filters.capability) === -1 ||
                    e.capabilityId === parseInt(filters.capability)
                ) &&
                (
                    !filters.category ||
                    parseInt(filters.category) === -1 ||
                    e.categoryId === parseInt(filters.category)
                ) &&
                (
                    !filters.competency ||
                    parseInt(filters.competency) === -1 ||
                    e.competencyId === parseInt(filters.competency)
                ) &&
                (
                    !filters.phase ||
                    parseInt(filters.phase) === -1 ||
                    e.phases.includes(parseInt(filters.phase))
                ) &&
                (
                    regex.test(e.title)
                )
            ) {
                matching.push(e);
            }
        });
        log.info("Fetched %s videos with %s filters from cache", matching.length, JSON.stringify(filters));
        return matching;
    } else {
        const findResult = await videoRepo.findByFiltersAndKeywordJoint({
            filters: {
                capabilityId: filters.capability ? parseInt(filters.capability) : -1,
                categoryId: filters.category ? parseInt(filters.category) : -1,
                competencyId: filters.competency ? parseInt(filters.competency) : -1,
                phaseId: filters.phase ? parseInt(filters.phase) : -1,
            },
            keyword: filters.keyword ? filters.keyword : '',
        });
        log.info("Fetched %s videos with %s filters from DB", findResult.rows.length, JSON.stringify(filters));
        return findResult.rows;
    }
};

const fetchAll = async () => {
    const cachedVal = myCache.get("videos");
    if (cachedVal) {
        return cachedVal;
    } else {
        const videos = await fetchByFilters({});
        myCache.set("videos", videos);
        videos.forEach(e => {
            myCache.set(e.id, e);
        });
        return (videos);
    }
};

const fetchAllWithUniqueTitles = async () => {
    const allVideos = await fetchAll();
    return filtering.filterAndSortByTitle(allVideos);
};

module.exports = {
    fetchSimilarVideoRecords,
    fetchAndResolveVideo,
    fetchByFilters,
    fetchAll,
    fetchAllWithUniqueTitles,
};
