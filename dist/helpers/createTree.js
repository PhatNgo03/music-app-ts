"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tree = void 0;
let count = 0;
const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        var _a;
        if (((_a = item.parent_id) !== null && _a !== void 0 ? _a : "").toString() === parentId) {
            count++;
            const newItem = Object.assign(Object.assign({}, item), { index: count });
            const children = createTree(arr, item._id.toString());
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
};
const tree = (arr, parentId = "") => {
    count = 0;
    return createTree(arr, parentId);
};
exports.tree = tree;
