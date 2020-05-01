const db = require("../../../database/connection");

const insert = (coursePhase) => {
    const query = "INSERT INTO course_phase VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [coursePhase.courseId, coursePhase.phaseId];
    return db.query(query, params);
};

const findAllByCourseId = (courseId) => {
    const query = "SELECT * FROM course_phase WHERE course_id=$1";
    return db.query(query, [courseId]);
};

const findAllByPhaseId = (phaseId) => {
    const query = "SELECT * FROM course_phase WHERE phase_id=$1";
    return db.query(query, [phaseId]);
};

const find = (courseId, phaseId) => {
    const query = "SELECT * FROM course_phase WHERE course_id=$1 AND phase_id=$2";
    const params = [courseId, phaseId];
    return db.query(query, params);
};

const removeByCourseId = (courseId) => {
    const query = "DELETE FROM course_phase WHERE course_id = $1 RETURNING *";
    return db.query(query, [courseId]);
};

const removeByPhaseId = (phaseId) => {
    const query = "DELETE FROM course_phase WHERE phase_id = $1 RETURNING *";
    return db.query(query, [phaseId]);
};

module.exports = {
    insert,
    findAllByCourseId,
    findAllByPhaseId,
    find,
    removeByCourseId,
    removeByPhaseId,
};
