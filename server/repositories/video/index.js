const db = require("../../database/connection");

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

const findByIdJoint = (id) => {
    const query = "SELECT " +
        "title(video) AS title, hyperlink(video) AS hyperlink, id(video) AS id, " +
        "title(capability) AS capability_title, id(capability) AS capability_id, " +
        "title(category) AS category_title, id(category) AS category_id, " +
        "title(competency) AS competency_title, id(competency) AS competency_id " +
        "FROM video " +
        "LEFT JOIN capability ON id(capability) = capability_id " +
        "LEFT JOIN category ON id(category) = category_id " +
        "LEFT JOIN competency ON id(competency) = competency_id " +
        "WHERE id(video)=$1";
    return db.query(query, [id]);
};

const findByIdWithFullInfo = (id) => {
    const query = "SELECT " +
        "ARRAY(SELECT phase_id(video_phase) FROM video_phase WHERE video_id(video_phase) = id(video)) AS phases, " +
        "title(video) AS title, hyperlink(video) AS hyperlink, id(video) AS id, " +
        "title(capability) AS capability_title, id(capability) AS capability_id, " +
        "title(category) AS category_title, id(category) AS category_id, " +
        "title(competency) AS competency_title, id(competency) AS competency_id " +
        "FROM video " +
        "LEFT JOIN capability ON id(capability) = capability_id " +
        "LEFT JOIN category ON id(category) = category_id " +
        "LEFT JOIN competency ON id(competency) = competency_id " +
        "WHERE id(video)=$1";
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

const findByFilters = (filters) => {
    const query = "SELECT * FROM video LEFT JOIN video_phase ON video_id(video_phase) = id WHERE " +
        "($1 = -1 OR capability_id = $1) AND " +
        "($2 = -1 OR category_id = $2) AND " +
        "($3 = -1 OR competency_id = $3) AND " +
        "($4 = -1 OR phase_id = $4)";
    const params = [filters.capabilityId, filters.categoryId, filters.competencyId, filters.phaseId];
    return db.query(query, params);
};

const findByKeyword = (keyword) => {
    const query = "SELECT * FROM video WHERE UPPER(title) LIKE UPPER($1)";
    return db.query(query, [`%${keyword}%`]);
};

const findByFiltersAndKeyword = (search) => {
    const query = "SELECT * FROM video LEFT JOIN video_phase ON video_id(video_phase) = id WHERE " +
        "($1 = -1 OR capability_id = $1) AND " +
        "($2 = -1 OR category_id = $2) AND " +
        "($3 = -1 OR competency_id = $3) AND " +
        "($4 = -1 OR phase_id = $4) AND " +
        "($5 = '%%' OR (UPPER(title) LIKE UPPER($5)))";
    const params = [search.filters.capabilityId, search.filters.categoryId,
        search.filters.competencyId, search.filters.phaseId, `%${search.keyword}%`];
    return db.query(query, params);
};

const findByFiltersAndKeywordJoint = (search) => {
    const query = "SELECT DISTINCT ON (id(video)) " +
        "ARRAY(SELECT phase_id(video_phase) FROM video_phase WHERE video_id(video_phase) = id(video)) AS phases, " +
        "title(video) AS title, hyperlink(video) AS hyperlink, id(video) AS id, " +
        "title(capability) AS capability_title, id(capability) AS capability_id, " +
        "title(category) AS category_title, id(category) AS category_id, " +
        "title(competency) AS competency_title, id(competency) AS competency_id " +
        "FROM video " +
        "LEFT JOIN capability ON id(capability) = capability_id " +
        "LEFT JOIN category ON id(category) = category_id " +
        "LEFT JOIN competency ON id(competency) = competency_id " +
        "LEFT JOIN video_phase ON video_id(video_phase) = id(video) " +
        "WHERE " +
        "($1 = -1 OR capability_id(video) = $1) AND " +
        "($2 = -1 OR category_id(video) = $2) AND " +
        "($3 = -1 OR competency_id(video) = $3) AND " +
        "($4 = -1 OR phase_id(video_phase) = $4) AND " +
        "($5 = '%%' OR (UPPER(title(video)) LIKE UPPER($5))) " +
        "ORDER BY id(video)";
    const params = [search.filters.capabilityId, search.filters.categoryId,
        search.filters.competencyId, search.filters.phaseId, `%${search.keyword}%`];
    return db.query(query, params);
};

module.exports = {
    insert,
    findById,
    findByIdJoint,
    update,
    removeById,
    findByFilters,
    findByKeyword,
    findByFiltersAndKeyword,
    findByIdWithFullInfo,
    findByFiltersAndKeywordJoint,
};
