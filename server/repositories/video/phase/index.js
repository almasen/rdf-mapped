const db = require("../../../database/connection");

const insert = (videoPhase) => {
    const query = "INSERT INTO video_phase VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [videoPhase.videoId, videoPhase.phaseId];
    return db.query(query, params);
};

const findAllByVideoId = (videoId) => {
    const query = "SELECT * FROM video_phase WHERE course_id=$1";
    return db.query(query, [videoId]);
};

const findAllByPhaseId = (phaseId) => {
    const query = "SELECT * FROM video_phase WHERE phaseId=$1";
    return db.query(query, [phaseId]);
};

const find = (videoId, phaseId) => {
    const query = "SELECT * FROM video_phase WHERE course_id=$1 AND phase_id=$2";
    const params = [videoId, phaseId];
    return db.query(query, params);
};

const removeByVideoId = (videoId) => {
    const query = "DELETE FROM video_phase WHERE course_id = $1 RETURNING *";
    return db.query(query, [videoId]);
};

const removeByPhaseId = (phaseId) => {
    const query = "DELETE FROM video_phase WHERE phase_id = $1 RETURNING *";
    return db.query(query, [phaseId]);
};

module.exports = {
    insert,
    findAllByVideoId,
    findAllByPhaseId,
    find,
    removeByVideoId,
    removeByPhaseId,
};
