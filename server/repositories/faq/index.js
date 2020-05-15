const db = require("../../database/connection");

const insert = (faq) => {
    const query = "INSERT INTO faq(question, answer) VALUES ($1, $2) " +
        "RETURNING *"; // returns passed faq with it's id set to corresponding id in database
    const params = [faq.question, faq.answer];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM faq WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM faq";
    return db.query(query);
};

const update = (faq) => {
    const query = "UPDATE faq SET question = $2, answer = $3 WHERE id = $1" +
        "RETURNING *"; // returns passed faq with it's id set to corresponding id in database
    const params = [faq.id, faq.question, faq.answer];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM faq WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

const findByKeyword = (keyword) => {
    const query = "SELECT * FROM faq WHERE UPPER(question) LIKE UPPER($1)";
    return db.query(query, [`%${keyword}%`]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findByKeyword,
    update,
    removeById,
};
