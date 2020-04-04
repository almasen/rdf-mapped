const db = require("../../database");

const insert = (notification) => {
    const query = "INSERT INTO notification(type, message, timestamp_sent, sender_id, receiver_id) VALUES ($1, $2, $3, $4, $5) " +
        "RETURNING *"; // returns passed notification with its id set to corresponding id in database
    const params = [notification.type, notification.message, notification.timestampSent, notification.senderId, notification.receiverId];
    return db.query(query, params);
};

const findByUserId = (id) => {
    const query = "SELECT * FROM notification WHERE receiver_id=$1";
    return db.query(query, [id]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM notification WHERE sender_id=$1 OR receiver_id=$1 RETURNING *";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    findByUserId,
    removeByUserId,
};
