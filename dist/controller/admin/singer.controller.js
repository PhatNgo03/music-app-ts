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
exports.changeMulti = exports.changeStatus = exports.detail = exports.deleteItem = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const config_1 = require("../../config/config");
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        find.fullName = objectSearch.regex;
    }
    const countSingers = yield singer_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 4,
        skip: 0,
        totalPage: 0,
    }, req.query, countSingers);
    const sort = {};
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if (typeof sortKey === 'string' &&
        typeof sortValue === 'string' &&
        ['asc', 'desc', '1', '-1'].includes(sortValue)) {
        sort[sortKey] = sortValue;
    }
    else {
        sort['createdAt'] = 'desc';
    }
    const records = yield singer_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .lean();
    for (const singer of records) {
        if ((_b = singer.createdBy) === null || _b === void 0 ? void 0 : _b.account_id) {
            const user = yield account_model_1.default.findById(singer.createdBy.account_id).lean();
            if (user) {
                singer.accountFullName = user.fullName;
                singer.accountEmail = user.email;
            }
            else {
                singer.accountFullName = "admin";
                singer.accountEmail = "";
            }
        }
    }
    res.render("admin/pages/singers/index.pug", {
        pageTitle: "Danh sách ca sĩ",
        records: records,
        filter: filter,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singer = yield singer_model_1.default.find({
        deleted: false
    });
    res.render("admin/pages/singers/create.pug", {
        pageTitle: "Tạo mới thông tin ca sĩ",
        singer: singer,
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.createdBy = {
            account_id: res.locals.user.id
        };
        const record = new singer_model_1.default(req.body);
        yield record.save();
        return res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
    }
    catch (error) {
        console.error("Lỗi khi tạo ca sĩ:", error);
        return res.status(500).render("admin/pages/singers/create.pug", {
            pageTitle: "Tạo mới ca sĩ",
            errorMessage: "Có lỗi xảy ra khi tạo ca sĩ"
        });
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const singers = yield singer_model_1.default.findOne(find);
        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            singers: singers,
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        yield singer_model_1.default.updateOne({ _id: id }, Object.assign(Object.assign({}, req.body), { $push: {
                updatedBy: updatedBy
            } }));
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.editPatch = editPatch;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield singer_model_1.default.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.deleteItem = deleteItem;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const singer = yield singer_model_1.default.findOne(find);
        if ((_a = singer === null || singer === void 0 ? void 0 : singer.createdBy) === null || _a === void 0 ? void 0 : _a.account_id) {
            const user = yield account_model_1.default.findOne({ _id: singer.createdBy.account_id });
            if (user) {
                singer.accountFullName = user.fullName;
                singer.accountEmail = user.email;
            }
        }
        if ((_b = singer === null || singer === void 0 ? void 0 : singer.deletedBy) === null || _b === void 0 ? void 0 : _b.account_id) {
            const deleter = yield account_model_1.default.findById(singer.deletedBy.account_id).lean();
            if (deleter) {
                singer.deletedBy.accountFullName = deleter.fullName;
                singer.deletedBy.accountEmail = deleter.email;
            }
        }
        const updatedBy = (_c = singer === null || singer === void 0 ? void 0 : singer.updatedBy) === null || _c === void 0 ? void 0 : _c.slice(-1)[0];
        if (updatedBy) {
            const userUpdated = yield account_model_1.default.findById(updatedBy.account_id).lean();
            if (userUpdated) {
                updatedBy.accountFullName = userUpdated.fullName;
                updatedBy.accountEmail = userUpdated.email;
            }
        }
        if (!singer) {
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
        }
        res.render("admin/pages/singers/detail", {
            pageTitle: "Thông tin chi tiết ca sĩ",
            singer: singer,
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield singer_model_1.default.updateOne({ _id: id }, {
        status: status,
        $push: {
            updatedBy: {
                account_id: res.locals.user.id,
                updatedAt: new Date()
            }
        }
    });
    res.redirect(`/admin/singers`);
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const type = req.body.type;
    const ids = req.body.ids
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");
    const adminId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!adminId) {
        res.status(401).send("Unauthorized");
    }
    if (ids.length === 0) {
        res.redirect(`/admin/singers`);
    }
    const updateCommon = {
        $push: {
            updatedBy: {
                account_id: adminId,
                updatedAt: new Date(),
            },
        },
    };
    switch (type) {
        case "active":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, Object.assign(Object.assign({}, updateCommon), { status: "active" }));
            break;
        case "inactive":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, Object.assign(Object.assign({}, updateCommon), { status: "inactive" }));
            break;
        case "delete-all":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, Object.assign({ deleted: true, deletedBy: {
                    account_id: adminId,
                    deletedAt: new Date(),
                } }, updateCommon));
            break;
        default:
            break;
    }
    res.redirect(`/admin/singers`);
});
exports.changeMulti = changeMulti;
