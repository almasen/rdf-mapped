const db = require("../../database");

const insert = (phase) => {
    const query = "INSERT INTO phase(title) VALUES ($1) " +
        "RETURNING *"; // returns passed phase with it's id set to corresponding id in database
    const params = [phase.title];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM phase WHERE id=$1";
    return db.query(query, [id]);
};

const update = (phase) => {
    const query = "UPDATE phase SET title = $2 WHERE id = $1" +
        "RETURNING *"; // returns passed phase with it's id set to corresponding id in database
    const params = [phase.id, phase.title];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM phase WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
};
