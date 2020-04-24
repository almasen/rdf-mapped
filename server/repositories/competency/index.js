const db = require("../../database/connection");

const insert = (competency) => {
    const query = "INSERT INTO competency(title, category_id) VALUES ($1, $2) " +
        "RETURNING *"; // returns passed competency with it's id set to corresponding id in database
    const params = [competency.title, competency.categoryId];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM competency WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM competency";
    return db.query(query);
};

const findAllByParent = (categoryId) => {
    const query = "SELECT * FROM competency WHERE category_id=$1";
    return db.query(query, [categoryId]);
};

const update = (competency) => {
    const query = "UPDATE competency SET title = $2 WHERE id = $1" +
        "RETURNING *"; // returns passed competency with it's id set to corresponding id in database
    const params = [competency.id, competency.title];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM competency WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

const findByKeyword = (keyword) => {
    const query = "SELECT * FROM competency WHERE UPPER(title) LIKE UPPER($1)";
    return db.query(query, [`%${keyword}%`]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findAllByParent,
    findByKeyword,
    update,
    removeById,
};
