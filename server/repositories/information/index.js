const db = require("../../database/connection");

const insert = (information) => {
    const query = "INSERT INTO information(type, content) VALUES ($1, $2) " +
        "RETURNING *"; // returns passed information entry with its id set to corresponding id in database
    const params = [information.type, information.content];
    return db.query(query, params);
};

const findByType = (type) => {
    const query = "SELECT * FROM information WHERE type=$1";
    return db.query(query, [type]);
};

const update = (information) => {
    const query =
        "UPDATE information SET content = $2 WHERE type=$1 RETURNING *";
    // returns passed information
    const params = [information.type, information.content];
    return db.query(query, params);
};

module.exports = {
    insert,
    findByType,
    update,
};
