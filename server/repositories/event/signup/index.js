const db = require("../../../database");

const insert = (signup) => {
    const query = "INSERT INTO sign_up VALUES ($1, $2, $3) " +
        "RETURNING *"; // returns inserted row
    const params = [signup.individualId, signup.eventId, signup.confirmed];
    return db.query(query, params);
};

const findAllByIndividualId = (individualId) => {
    const query = "SELECT * FROM sign_up WHERE individual_id=$1";
    return db.query(query, [individualId]);
};

const findAllByIndividualIdConfirmed = (individualId) => {
    const query = "SELECT * FROM sign_up WHERE individual_id=$1 AND confirmed=true";
    return db.query(query, [individualId]);
};

const findAllByEventId = (eventId) => {
    const query = "SELECT * FROM sign_up WHERE event_id=$1";
    return db.query(query, [eventId]);
};

const findAllByEventIdConfirmed = (eventId) => {
    const query = "SELECT * FROM sign_up WHERE event_id=$1 AND confirmed=true RETURNING *";
    return db.query(query, [eventId]);
};

const find = (individualId, eventId) => {
    const query = "SELECT * FROM sign_up WHERE individual_id = $1 AND event_id=$2";
    const params = [individualId, eventId];
    return db.query(query, params);
};

const update = (signup) => {
    const query = "UPDATE sign_up SET confirmed = $1, attended = $2 WHERE individual_id = $3 AND event_id = $4 RETURNING *";
    const params = [signup.confirmed, signup.attended, signup.individualId, signup.eventId];
    return db.query(query, params);
};

const findUsersSignedUp = (eventId) => {
    const query = "SELECT event_id,individual_id,confirmed,attended,firstname as first_name,lastname as last_name," +
    "user_id,email,username,date_registered " +
        "FROM sign_up LEFT JOIN individual ON individual_id = id(individual) RIGHT JOIN \"user\" ON user_id=id(\"user\")" +
        "WHERE event_id = $1";
    return db.query(query, [eventId]);
};

const findUsersSignedUpConfirmed = (eventId) => {
    const query = "SELECT event_id,individual_id,confirmed,attended,firstname as first_name,lastname as last_name," +
        "user_id,email,username,date_registered " +
        "FROM sign_up LEFT JOIN individual ON individual_id = id(individual) RIGHT JOIN \"user\" ON user_id=id(\"user\")" +
        "WHERE event_id = $1 and confirmed=true";
    return db.query(query, [eventId]);
};

const removeByIndividualId = (individualId) => {
    const query = "DELETE FROM sign_up WHERE individual_id = $1 RETURNING *";
    return db.query(query, [individualId]);
};

const removeByEventId = (eventId) => {
    const query = "DELETE FROM sign_up WHERE event_id = $1 RETURNING *";
    return db.query(query, [eventId]);
};

const removeByEventCreatorId = (eventId) => {
    const query = "DELETE FROM sign_up WHERE event_id IN " +
        "(SELECT id as event_id FROM event WHERE user_id=$1) RETURNING *";
    return db.query(query, [eventId]);
};
module.exports = {
    insert,
    findAllByIndividualId,
    findAllByEventId,
    find,
    update,
    findUsersSignedUp,
    removeByIndividualId,
    removeByEventCreatorId,
    removeByEventId,
    findAllByIndividualIdConfirmed,
    findAllByEventIdConfirmed,
    findUsersSignedUpConfirmed,
};
