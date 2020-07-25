const db = require("../../database/connection");

const findByEmail = (email) => {
    const query = "SELECT * FROM admin WHERE email=$1";
    return db.query(query, [email]);
};

const findById = (id) => {
    const query = "SELECT * FROM admin WHERE id=$1";
    return db.query(query, [id]);
};


module.exports = {
    findByEmail,
    findById,
};
