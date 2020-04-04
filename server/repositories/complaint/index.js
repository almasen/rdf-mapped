const db = require("../../database");

const insert = (complaint) => {
    const query = "INSERT INTO complaint(type, message, user_id) VALUES ($1, $2, $3) " +
        "RETURNING *";
    const params = [complaint.type, complaint.message, complaint.userId];
    return db.query(query, params);
};

const find = (id) => {
    const query = "SELECT * FROM complaint WHERE id=$1";
    return db.query(query, [id]);
};

const findByUserId = (userId) => {
    const query = "SELECT * FROM complaint WHERE user_id=$1";
    return db.query(query, [userId]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM complaint WHERE user_id = $1 RETURNING *";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    find,
    removeByUserId,
    findByUserId,
};
