const db = require("../../database/connection");

const insert = (category) => {
    const query = "INSERT INTO category(title, capability_id) VALUES ($1, $2) " +
        "RETURNING *"; // returns passed category with it's id set to corresponding id in database
    const params = [category.title, category.capabilityId];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM category WHERE id=$1";
    return db.query(query, [id]);
};

const findAllByParent = (capabilityId) => {
    const query = "SELECT * FROM category WHERE capability_id=$1";
    return db.query(query, [capabilityId]);
};

const update = (category) => {
    const query = "UPDATE category SET title = $2 WHERE id = $1" +
        "RETURNING *"; // returns passed category with it's id set to corresponding id in database
    const params = [category.id, category.title];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM category WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

const findByKeyword = (keyword) => {
    const query = "SELECT * FROM course WHERE title LIKE $1";
    return db.query(query, [`%${keyword}%`]);
};

module.exports = {
    insert,
    findById,
    findAllByParent,
    findByKeyword,
    update,
    removeById,
};
