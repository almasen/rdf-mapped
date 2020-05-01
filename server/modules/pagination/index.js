const {calculateLimitAndOffset, paginate} = require('paginate-info');

const getPageData = (currentPageIn, pageSizeIn, data) => {
    const currentPage = currentPageIn ? currentPageIn : 1;
    const pageSize = pageSizeIn ? pageSizeIn : 10;
    const {limit, offset} = calculateLimitAndOffset(currentPage, pageSize);
    const count = data.length;
    const paginatedData = data.slice(offset, offset + limit);
    const paginationInfo = paginate(currentPage, count, data, pageSize);
    paginationInfo.pageSize = parseInt(pageSize);
    return {
        meta: paginationInfo,
        data: paginatedData,
    };
};

module.exports = {
    getPageData,
};

