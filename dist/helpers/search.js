"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (query) => {
    const objectSearch = {
        keyword: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        objectSearch.regex = new RegExp(objectSearch.keyword, "i");
    }
    return objectSearch;
};
