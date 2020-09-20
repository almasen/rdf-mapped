/**
 * @module video
 */
const videoRepo = require("../../repositories/video");
const videoPhaseRepo = require("../../repositories/video/phase");
const log = require("../../util/log");
const filtering = require("../filtering");
const cache = require("../cache");
const _ = require('lodash');

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
    if (cache.has("videos")) {
        const cachedVal = cache.get("videos");
        log.info("Video %s: Fetching similar videos from CACHE", video.id);
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
    log.info("Video %s: Fetching all info", videoId);
    if (cache.has(`video-${videoId}`)) {
        log.info("Video %s: Fetched all info from CACHE", videoId);
        return cache.get(`video-${videoId}`);
    } else {
        throw new Error(`No video found by id '${videoId}'`);
    }
};

/**
 * Fetch videos based on input filters.
 * Fetches from cache if possible
 * @param {Object} filters
 * @return {Array} matching video objects
 */
const fetchByFilters = async (filters) => {
    if (cache.has("videos")) {
        const cachedVal = cache.get("videos");
        const matching = [];
        const safeKey = _.escapeRegExp(filters.keyword);
        const regex = RegExp(safeKey ? safeKey : '', 'i');
        cachedVal.forEach(e => {
            if (
                (
                    !filters.capability ||
                    parseInt(filters.capability, 10) === -1 ||
                    e.capabilityId === parseInt(filters.capability, 10)
                ) &&
                (
                    !filters.category ||
                    parseInt(filters.category, 10) === -1 ||
                    e.categoryId === parseInt(filters.category, 10)
                ) &&
                (
                    !filters.competency ||
                    parseInt(filters.competency, 10) === -1 ||
                    e.competencyId === parseInt(filters.competency, 10)
                ) &&
                (
                    !filters.phase ||
                    parseInt(filters.phase, 10) === -1 ||
                    e.phases.includes(parseInt(filters.phase, 10))
                ) &&
                (
                    regex.test(e.title)
                )
            ) {
                matching.push(e);
            }
        });
        log.info("Fetched %s videos with %s filters from CACHE", matching.length, JSON.stringify(filters));
        return matching;
    } else {
        const findResult = await videoRepo.findByFiltersAndKeywordJoint({
            filters: {
                capabilityId: filters.capability ? parseInt(filters.capability, 10) : -1,
                categoryId: filters.category ? parseInt(filters.category, 10) : -1,
                competencyId: filters.competency ? parseInt(filters.competency, 10) : -1,
                phaseId: filters.phase ? parseInt(filters.phase, 10) : -1,
            },
            keyword: filters.keyword ? filters.keyword : '',
        });
        log.info("Fetched %s videos with %s filters from DB", findResult.rows.length, JSON.stringify(filters));
        return findResult.rows;
    }
};

/**
 * Fetch call videos.
 * Fetches from cache if possible, otherwise
 * fetches from database and caches values
 * for future use.
 */
const fetchAll = async () => {
    if (cache.has("videos")) {
        return cache.get("videos");
    } else {
        const videos = await fetchByFilters({});
        cache.set("videos", videos);
        videos.forEach(e => {
            cache.set(`video-${e.id}`, e);
        });
        return (videos);
    }
};

/**
 * Fetch all videos that have unique titles.
 * Fetches all videos then filters and sorts
 * by the titles.
 * @return {Array} videos
 */
const fetchAllWithUniqueTitles = async () => {
    const allVideos = await fetchAll();
    return filtering.filterAndSortByTitle(allVideos);
};

/**
 * Add a new video: insert new video object to the database,
 * and immediately attempt to update the cache with the new object.
 * The video object is only cached if it can successfully be updated
 * from the LinkedIn Learning API.
 * @param {Object} video
 */
const addNewVideo = async (video) => {
    const insertionResult = await videoRepo.insert({
        title: video.title,
        hyperlink: video.hyperlink,
        capabilityId: parseInt(video.capability, 10),
        categoryId: parseInt(video.category, 10),
        competencyId: parseInt(video.competency, 10),
        urn: video.urn,
    });
    const videoId = insertionResult.rows[0].id;
    if (Array.isArray(video.phases)) {
        for await (const phase of video.phases) {
            await videoPhaseRepo.insert({
                videoId,
                phaseId: parseInt(phase, 10),
            });
        }
    } else {
        await videoPhaseRepo.insert({
            videoId,
            phaseId: parseInt(video.phases, 10),
        });
    }
    log.info("Video %d: Successfully inserted new record to database", videoId);
    log.info("Video %d: Caching new video...", videoId);
    const findResult = await videoRepo.findByIdWithFullInfo(videoId);
    const temp = findResult.rows[0];
    cache.set(`video-${videoId}`, temp);
    await cache.updateFromAPI(`video-${videoId}`);
    log.info("Video %d: Cache updated with new video.", videoId);
    return videoId;
};

/**
 * Update a video: update a stored video object in the database,
 * and immediately attempt to update the cache with the object.
 * The video object is only cached if it can successfully be updated
 * from the LinkedIn Learning API.
 * @param {Object} video
 */
const updateVideo = async (video) => {
    const videoId = parseInt(video.id, 10);
    await videoRepo.update({
        title: video.title,
        hyperlink: video.hyperlink,
        capabilityId: parseInt(video.capability, 10),
        categoryId: parseInt(video.category, 10),
        competencyId: parseInt(video.competency, 10),
        urn: video.urn,
        id: videoId,
    });
    await videoPhaseRepo.removeByVideoId(videoId);
    if (Array.isArray(video.phases)) {
        for await (const phase of video.phases) {
            await videoPhaseRepo.insert({
                videoId,
                phaseId: parseInt(phase, 10),
            });
        }
    } else {
        await videoPhaseRepo.insert({
            videoId,
            phaseId: parseInt(video.phases, 10),
        });
    }
    log.info("Video %d: Successfully updated record in database", videoId);
    log.info("Video %d: Caching updated video...", videoId);
    const findResult = await videoRepo.findByIdWithFullInfo(videoId);
    const temp = findResult.rows[0];
    const videosArray = cache.get("videos");
    const index = videosArray.findIndex((e) => {
        return e.id === videoId;
    });
    videosArray[index] = temp;
    cache.set(`video-${videoId}`, temp);
    cache.set("videos", videosArray);
    log.info("Video %d: Cache updated with updated video.", videoId);
};

/**
 * Delete a video from the database and efficiently remove it
 * from the cache so full flushing of cache can be avoided.
 * @param {Number} id
 */
const deleteVideo = async (id) => {
    log.info("Video %d: Deleting video with all details...", id);
    await videoRepo.removeById(id);
    await videoPhaseRepo.removeByVideoId(id);
    log.info("Video %d: Deleting video from cache...", id);
    cache.del(`video-${id}`);
    const videosArray = cache.get("videos");
    const index = videosArray.findIndex((e) => {
        return e.id === parseInt(id, 10);
    });
    videosArray.splice(index, 1);
    cache.set("videos", videosArray);
    log.info("Video %d: Deleted video from cache...", id);
    log.info("Video %d: Deleted video with all details...", id);
};

module.exports = {
    fetchSimilarVideoRecords,
    fetchAndResolveVideo,
    fetchByFilters,
    fetchAll,
    fetchAllWithUniqueTitles,
    addNewVideo,
    updateVideo,
    deleteVideo,
};
