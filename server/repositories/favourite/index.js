const db = require("../../database");

const insert = (favourite) => {
    const query = "INSERT INTO favourite VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [favourite.individualId, favourite.eventId];
    return db.query(query, params);
};

const findAllByIndividualId = (individualId) => {
    const query = "SELECT * FROM favourite WHERE individual_id=$1";
    return db.query(query, [individualId]);
};

const findAllByEventId = (eventId) => {
    const query = "SELECT * FROM favourite WHERE event_id=$1";
    return db.query(query, [eventId]);
};

const find = (individualId, eventId) => {
    const query = "SELECT * FROM favourite WHERE individual_id = $1 AND event_id=$2";
    const params = [individualId, eventId];
    return db.query(query, params);
};

const remove = (favourite) => {
    const query = "DELETE FROM favourite WHERE individual_id=$1 AND event_id=$2 RETURNING *";
    const params = [favourite.individualId, favourite.eventId];
    return db.query(query, params);
};

const removeByIndividualId = (individualId) => {
    const query = "DELETE FROM favourite WHERE individual_id=$1 RETURNING *";
    return db.query(query, [individualId]);
};

const removeByEventId = (eventId) => {
    const query = "DELETE FROM favourite WHERE event_id=$1 RETURNING *";
    return db.query(query, [eventId]);
};

const removeByEventCreatorId = (userId) => {
    const query = "DELETE FROM favourite WHERE event_id IN " +
        "(SELECT id AS event_id FROM event WHERE user_id = $1) RETURNING *";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    findAllByIndividualId,
    findAllByEventId,
    find,
    remove,
    removeByIndividualId,
    removeByEventCreatorId,
    removeByEventId,
};
