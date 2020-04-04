const db = require("../../database");

const insertResetToken = (resetRecord) => {
    const query = "INSERT INTO reset(user_id,password_token,expiry_date) VALUES($1,$2,$3) RETURNING *";
    const params = [resetRecord.userId, resetRecord.token, resetRecord.expiryDate];
    return db.query(query, params);
};

const findLatestByUserId = (userId) => {
    const query = "SELECT * FROM reset WHERE user_id =$1 ORDER BY expiry_date DESC LIMIT 1";
    const params = [userId];
    return db.query(query, params);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM reset WHERE user_id =$1 RETURNING *";
    const params = [userId];
    return db.query(query, params);
};

module.exports = {
    insertResetToken,
    findLatestByUserId,
    removeByUserId,
};
