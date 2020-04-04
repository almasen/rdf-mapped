const db = require("../../../database");

const insert = (eventCause) => {
    const query = "INSERT INTO event_cause VALUES ($1, $2) RETURNING *"; // returns inserted row
    const params = [eventCause.eventId, eventCause.causeId];
    return db.query(query, params);
};

const findAllByCauseId = (causeId) => {
    const query = "SELECT * FROM event_cause WHERE cause_id=$1";
    return db.query(query, [causeId]);
};

const findAllByEventId = (eventId) => {
    const query = "SELECT * FROM event_cause WHERE event_id=$1";
    return db.query(query, [eventId]);
};

const findCausesByEventId = (eventId) => {
    const query = "SELECT cause_id as id,name,title, description FROM event_cause "+
    "INNER JOIN cause on id(cause) = cause_id WHERE event_id=$1";
    return db.query(query, [eventId]);
};

const find = (causeId, eventId) => {
    const query = "SELECT * FROM event_cause WHERE cause_id = $1 AND event_id=$2";
    const params = [causeId, eventId];
    return db.query(query, params);
};

const removeByEventId = (eventId) => {
    const query = "DELETE FROM event_cause WHERE event_id = $1 RETURNING *";
    return db.query(query, [eventId]);
};

const removeByEventCreatorId = (userId) => {
    const query = "DELETE FROM event_cause WHERE event_id IN " +
        "(SELECT id as event_id FROM event WHERE user_id=$1) RETURNING *";
    return db.query(query, [userId]);
};
module.exports = {
    insert,
    findAllByCauseId,
    findAllByEventId,
    find,
    removeByEventId,
    removeByEventCreatorId,
    findCausesByEventId,
};
