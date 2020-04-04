const db = require("../../../database");

const insert = (userId, causeId) => {
    const query = "INSERT INTO selected_cause VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [userId, causeId];
    return db.query(query, params);
};

const insertMultiple = (userId, causes) => {
    const query = "INSERT INTO selected_cause SELECT $1 id, x FROM unnest($2::int[]) x " +
        "RETURNING *"; // returns inserted rows/selected causes
    const params = [userId, causes];
    return db.query(query, params);
};

const deleteUnselected = (userId, causes) => {
    const query = "DELETE FROM selected_cause WHERE cause_id NOT IN (SELECT * FROM unnest($2::int[])) AND user_id = $1" +
        "RETURNING *"; // returns deleted selected causes
    const params = [userId, causes];
    return db.query(query, params);
};

const unselectAll = (userId) => {
    const query = "DELETE FROM selected_cause WHERE user_id = $1" +
        "RETURNING *"; // returns deleted selected causes
    const params = [userId];
    return db.query(query, params);
};

const deleteMultiple = (userId, causes) => {
    const query = "DELETE FROM selected_cause WHERE cause_id IN (SELECT * FROM unnest($2::int[])) AND user_id = $1" +
        "RETURNING *"; // returns deleted selected causes
    const params = [userId, causes];
    return db.query(query, params);
};

const findByUserId = (userId) => {
    const query = "SELECT * FROM selected_cause LEFT JOIN cause on cause_id = id(cause) WHERE user_id=$1";
    return db.query(query, [userId]);
};
const findByCauseId = (causeId) => {
    const query = "SELECT * FROM selected_cause WHERE cause_id=$1";
    return db.query(query, [causeId]);
};
const find = (userId, causeId) => {
    const query = "SELECT * FROM selected_cause WHERE user_id = $1 AND cause_id=$2";
    const params = [userId, causeId];
    return db.query(query, params);
};

const findEventsSelectedByUser = (userId, whereClause) => {
    whereClause = whereClause || ""; // if whereClause is not defined, default value is empty string
    if (whereClause === "") whereClause = "where ";
    else whereClause += " and ";
    const query = "select id(event) as event_id,name(event),address_id,women_only,spots , address_visible,minimum_age,photo_id," +
        "physical, add_info,content,date,cause_id(event_cause),name(cause) as cause_name,description as cause_description," +
        "user_id(event) as event_creator_id,address_1,address_2,postcode,city,region,lat,long, " +
        "ARRAY(SELECT user_id from sign_up " +
        "left join individual on id(individual) = individual_id where event_id = id(event)) as volunteers, " +
        "ARRAY(SELECT user_id from favourite "+
        "left join individual on id(individual) = individual_id where event_id = id(event)) as favourited " +
        "FROM event INNER join event_cause on id(event) = event_id " +
        "inner join selected_cause on cause_id(event_cause)=cause_id(selected_cause) " +
        "inner join cause on cause_id(event_cause) = id(cause) " +
        "inner join address on id(address) = address_id " +
        whereClause + "user_id(selected_cause) = $1";
    return db.query(query, [userId]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM selected_cause WHERE user_id = $1 RETURNING *";
    const params = [userId];
    return db.query(query, params);
};

module.exports = {
    insert,
    insertMultiple,
    deleteUnselected,
    deleteMultiple,
    findByUserId,
    findByCauseId,
    findEventsSelectedByUser,
    find,
    unselectAll,
    removeByUserId,
};
