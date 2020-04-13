const db = require("../../database/connection");

const insert = (capability) => {
    const query = "INSERT INTO capability(title) VALUES ($1) " +
        "RETURNING *"; // returns passed capability with it's id set to corresponding id in database
    const params = [capability.title];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM capability WHERE id=$1";
    return db.query(query, [id]);
};

const update = (capability) => {
    const query = "UPDATE capability SET title = $2 WHERE id = $1" +
        "RETURNING *"; // returns passed capability with it's id set to corresponding id in database
    const params = [capability.id, capability.title];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM capability WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

const findByKeyword = (keyword) => {
    const query = "SELECT * FROM course WHERE title LIKE $1";
    return db.query(query, [`%${keyword}%`]);
};

module.exports = {
    insert,
    findById,
    findByKeyword,
    update,
    removeById,
};
