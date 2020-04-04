const db = require("../../database");

const insert = (authentication) => {
    const query = "INSERT INTO authentication(token, creation_date, user_id) VALUES ($1, $2, $3)" +
        "RETURNING *"; // returns passed authentication with it's id set to corresponding id in database
    const params = [authentication.token, authentication.creationDate, authentication.userId];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM authentication WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM authentication";
    return db.query(query);
};

const findAllByUserID = (userId) => {
    const query = "SELECT * FROM authentication WHERE user_id=$1";
    return db.query(query, [userId]);
};

const findLatestByUserID = (userId) => {
    const query = "SELECT * FROM authentication WHERE user_id=$1 ORDER BY creation_date DESC LIMIT 1";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findAllByUserID,
    findLatestByUserID,
};
