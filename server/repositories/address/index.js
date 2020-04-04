const db = require("../../database");

const insert = (address) => {
    const query = "INSERT INTO address(address_1, address_2, postcode, city, region, lat, long) VALUES ($1, $2, $3, $4, $5, $6, $7) " +
        "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [address.address1, address.address2, address.postcode, address.city, address.region, address.lat, address.long];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM address WHERE id=$1";
    return db.query(query, [id]);
};

const update = (address) => {
    const query = "UPDATE address SET address_1 = $1, address_2 = $2, postcode = $3, city = $4, region = $5, " +
        "lat = $6, long = $7 WHERE id = $8" +
        "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [address.address1, address.address2, address.postcode, address.city, address.region, address.lat,
        address.long, address.id];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM address WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
};
