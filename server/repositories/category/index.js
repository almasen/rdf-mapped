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

const findAll = () => {
    const query = "SELECT * FROM category";
    return db.query(query);
};

const findAllByParent = (capabilityId) => {
    const query = "SELECT * FROM category WHERE capability_id=$1";
    return db.query(query, [capabilityId]);
};

const findAllByParentJoint = (capabilityId) => {
    const query = "SELECT * FROM category LEFT JOIN capability ON id(capability) = capability_id WHERE capability_id=$1";
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
    const query = "SELECT * FROM category WHERE UPPER(title) LIKE UPPER($1)";
    return db.query(query, [`%${keyword}%`]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findAllByParent,
    findAllByParentJoint,
    findByKeyword,
    update,
    removeById,
};
