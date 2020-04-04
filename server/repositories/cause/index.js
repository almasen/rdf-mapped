const db = require("../../database");

const insert = (cause) => {
    const query = "INSERT INTO cause(name,description, title) VALUES ($1, $2, $3) " +
        "RETURNING *"; // returns passed cause with it's id set to corresponding id in database
    const params = [cause.name, cause.description, cause.title];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM cause WHERE id=$1";
    return db.query(query, [id]);
};
const findByName = (name) => {
    const query = "SELECT * FROM cause WHERE name=$1";
    return db.query(query, [name]);
};
const findAll = () => {
    const query = "SELECT * FROM cause";
    return db.query(query);
};

module.exports = {
    insert: insert,
    findById: findById,
    findByName: findByName,
    findAll: findAll,
};
