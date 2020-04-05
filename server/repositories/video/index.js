const db = require("../../database");

const insert = (video) => {
    const query = "INSERT INTO video(title, hyperlink, capability_id, category_id, competency_id) VALUES ($1, $2, $3, $4, $5) " +
        "RETURNING *"; // returns passed video with it's id set to corresponding id in database
    const params = [video.title, video.hyperlink, video.capabilityId, video.categoryId, video.competencyId];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM video WHERE id=$1";
    return db.query(query, [id]);
};

const update = (video) => {
    const query = "UPDATE video SET title = $2, hyperlink = $3, capability_id = $4, category_id = $5, competency_id = $6 WHERE id = $1" +
        "RETURNING *"; // returns passed video with it's id set to corresponding id in database
    const params = [video.id, video.title, video.hyperlink, video.capabilityId, video.categoryId, video.competencyId];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM video WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
};
