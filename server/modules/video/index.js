const videoRepo = require("../../repositories/video");
const videoPhaseRepo = require("../../repositories/video/phase");
const log = require("../../util/log");
const filtering = require("../filtering");
const cache = require("../cache");

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
        // const findResult = await videoRepo.findByIdWithFullInfo(videoId);
        // if (findResult.rows.length < 1) { // TODO: disabled direct fetching of non-cached videos
        throw new Error(`No video found by id '${videoId}'`);
        // }
        // log.info("Video %s: Fetched all info from DB", videoId);
        // return findResult.rows[0];
    }
};

const fetchByFilters = async (filters) => {
    if (cache.has("videos")) {
        const cachedVal = cache.get("videos");
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
        log.info("Fetched %s videos with %s filters from CACHE", matching.length, JSON.stringify(filters));
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

const fetchAllWithUniqueTitles = async () => {
    const allVideos = await fetchAll();
    return filtering.filterAndSortByTitle(allVideos);
};

/**
 * Add a new video
 * @param {Object} video
 */
const addNewVideo = async (video) => {
    const insertionResult = await videoRepo.insert({
        title: video.title,
        hyperlink: video.hyperlink,
        capabilityId: parseInt(video.capability),
        categoryId: parseInt(video.category),
        competencyId: parseInt(video.competency),
        urn: video.urn,
    });
    const videoId = insertionResult.rows[0].id;
    if (Array.isArray(video.phases)) {
        for await (const phase of video.phases) {
            await videoPhaseRepo.insert({
                videoId,
                phaseId: parseInt(phase),
            });
        }
    } else {
        await videoPhaseRepo.insert({
            videoId,
            phaseId: parseInt(video.phases),
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

const updateVideo = async (video) => {
    const videoId = parseInt(video.id);
    await videoRepo.update({
        title: video.title,
        hyperlink: video.hyperlink,
        capabilityId: parseInt(video.capability),
        categoryId: parseInt(video.category),
        competencyId: parseInt(video.competency),
        urn: video.urn,
        id: videoId,
    });
    await videoPhaseRepo.removeByVideoId(videoId);
    if (Array.isArray(video.phases)) {
        for await (const phase of video.phases) {
            await videoPhaseRepo.insert({
                videoId,
                phaseId: parseInt(phase),
            });
        }
    } else {
        await videoPhaseRepo.insert({
            videoId,
            phaseId: parseInt(video.phases),
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

const deleteVideo = async (id) => {
    log.info("Video %d: Deleting video with all details...", id);
    await videoRepo.removeById(id);
    await videoPhaseRepo.removeByVideoId(id);
    log.info("Video %d: Deleting video from cache...", id);
    cache.del(`video-${id}`);
    const videosArray = cache.get("videos");
    const index = videosArray.findIndex((e) => {
        return e.id === parseInt(id);
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
