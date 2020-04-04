const db = require("../../database");

const insert = (reportUser) => {
    const query = "INSERT INTO report_user(type, message, user_reported, user_reporting) VALUES ($1, $2, $3, $4) " +
        "RETURNING *";
    const params = [reportUser.type, reportUser.message, reportUser.userReported, reportUser.userReporting];
    return db.query(query, params);
};

const find = (id) => {
    const query = "SELECT * FROM report_user WHERE id=$1";
    return db.query(query, [id]);
};

const findByUserId = (userId) => {
    const query = "SELECT * FROM report_user  WHERE user_reported = $1 OR user_reporting = $1";
    return db.query(query, [userId]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM report_user WHERE user_reported = $1 OR user_reporting = $1";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    find,
    removeByUserId,
    findByUserId,
};
