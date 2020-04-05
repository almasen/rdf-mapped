const db = require("../../database/connection");

const insert = (category) => {
    const query = "INSERT INTO category(title) VALUES ($1) " +
        "RETURNING *"; // returns passed category with it's id set to corresponding id in database
    const params = [category.title];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM category WHERE id=$1";
    return db.query(query, [id]);
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

module.exports = {
    insert,
    findById,
    update,
    removeById,
};
