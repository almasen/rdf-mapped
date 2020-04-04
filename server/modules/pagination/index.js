const {calculateLimitAndOffset, paginate} = require('paginate-info');

module.exports = {
    getPageData: (req, data) => {
        const {query: {currentPage, pageSize}} = req;
        const {limit, offset} = calculateLimitAndOffset(currentPage, pageSize);
        const count = data.length;
        const paginatedData = data.slice(offset, offset + limit);
        const paginationInfo = paginate(currentPage, count, paginatedData);
        return {
            meta: paginationInfo,
            events: paginatedData,
        };
    },
};

