"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.deleteItem = exports.editPatch = exports.edit = exports.changeMulti = exports.changeStatus = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const createTree_1 = require("../../helpers/createTree");
const config_1 = require("../../config/config");
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = req.query;
    let filter = (0, filterStatus_1.default)({ status: (_a = query.status) !== null && _a !== void 0 ? _a : "active" });
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const countTopics = yield topic_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 4,
        skip: 0,
        totalPage: 0,
    }, req.query, countTopics);
    const sort = {};
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if (typeof sortKey === 'string' &&
        typeof sortValue === 'string' &&
        ['asc', 'desc', '1', '-1'].includes(sortValue)) {
        sort[sortKey] = sortValue;
    }
    else {
        sort['position'] = 'desc';
    }
    const records = yield topic_model_1.default.find(find).sort(sort)
        .limit(objectPagination.limitItems).skip(objectPagination.skip).lean();
    const allRecords = yield topic_model_1.default.find({ deleted: false }).lean();
    const newRecords = (0, createTree_1.tree)(allRecords);
    res.render("admin/pages/topics/index.pug", {
        pageTitle: "Trang danh sách chủ đề",
        records: records,
        treeRecords: newRecords,
        filter: filter,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield topic_model_1.default.find({ deleted: false }).lean();
        const newRecords = (0, createTree_1.tree)(records);
        res.render("admin/pages/topics/create.pug", {
            pageTitle: "Tạo chủ đề bài hát",
            records: newRecords,
            parent_id: ""
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.position == "") {
        const count = yield topic_model_1.default.countDocuments();
        req.body.position = count + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new topic_model_1.default(req.body);
    yield record.save();
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
});
exports.createPost = createPost;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield topic_model_1.default.updateOne({ _id: id }, {
        status: status,
    });
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            yield topic_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "active",
            });
            break;
        case "inactive":
            yield topic_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
            });
            break;
        case "delete-all":
            yield topic_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true,
            });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                yield topic_model_1.default.updateOne({ _id: id }, {
                    position: position,
                });
            }
            break;
        default:
            break;
    }
    res.redirect(`/admin/topics`);
});
exports.changeMulti = changeMulti;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const topics = yield topic_model_1.default.findOne(find).lean();
        const records = yield topic_model_1.default.find({ deleted: false }).lean();
        const newRecords = (0, createTree_1.tree)(records);
        res.render("admin/pages/topics/edit.pug", {
            pageTitle: "Chỉnh sửa chủ đề bài hát",
            topics: topics,
            records: newRecords,
            parent_id: ((_a = topics === null || topics === void 0 ? void 0 : topics.parent_id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        });
    }
    catch (error) {
        console.error("Error in edit:", error);
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    try {
        yield topic_model_1.default.updateOne({ _id: id }, req.body);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
    res.redirect("back");
});
exports.editPatch = editPatch;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield topic_model_1.default.updateOne({ _id: id }, {
        deleted: true,
    });
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
});
exports.deleteItem = deleteItem;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const topic = yield topic_model_1.default.findOne(find);
        if (!topic) {
            res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
        }
        res.render("admin/pages/topics/detail", {
            pageTitle: topic === null || topic === void 0 ? void 0 : topic.title,
            topic: topic,
        });
    }
    catch (error) {
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.detail = detail;
