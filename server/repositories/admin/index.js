const db = require("../../database/connection");

const findByEmail = (email) => {
    const query = "SELECT * FROM admin WHERE email=$1";
    return db.query(query, [email]);
};

module.exports = {
    findByEmail,
};
