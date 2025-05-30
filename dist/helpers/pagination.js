"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = paginate;
function paginate(objectPagination, query, countProducts) {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page, 10);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    return objectPagination;
}
