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
exports.detail = exports.deleteItem = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const config_1 = require("../../config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const md5_1 = __importDefault(require("md5"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let find = {
        deleted: false
    };
    const records = yield account_model_1.default.find(find).select("-password -token");
    for (const record of records) {
        const role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
        for (const item of records) {
            const user = yield account_model_1.default.findOne({
                _id: item.createdBy.account_id
            });
            if (user) {
                item.accountFullName = user.fullName;
                item.accountEmail = user.email;
            }
            const updatedBy = (_a = item.updatedBy) === null || _a === void 0 ? void 0 : _a.slice(-1)[0];
            if (updatedBy) {
                const userUpdated = yield account_model_1.default.findOne({
                    _id: updatedBy.account_id,
                });
                if (userUpdated) {
                    updatedBy.accountFullName = userUpdated.fullName;
                    updatedBy.accountEmail = userUpdated.email;
                }
                else {
                    updatedBy.accountFullName = "admin";
                    updatedBy.accountEmail = "";
                }
            }
            if ((_b = item.deletedBy) === null || _b === void 0 ? void 0 : _b.account_id) {
                const deleter = yield account_model_1.default.findById(item.deletedBy.account_id).lean();
                if (deleter) {
                    item.deletedBy.accountFullName = deleter.fullName;
                    item.deletedBy.accountEmail = deleter.email;
                }
            }
        }
    }
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles,
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role_id, email, password } = req.body;
        const emailExist = yield account_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (emailExist) {
            console.error("Email đã tồn tại", email);
            return res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts/create`);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(role_id)) {
            console.error("role_id không hợp lệ:", role_id);
            return res.status(400).render("admin/pages/auth/login.pug", {
                pageTitle: "Đăng nhập",
                errorMessage: "Role không hợp lệ"
            });
        }
        req.body.createdBy = {
            account_id: res.locals.user.id
        };
        const hashedPassword = (0, md5_1.default)(password);
        const record = new account_model_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword, role_id: new mongoose_1.default.Types.ObjectId(role_id) }));
        yield record.save();
        return res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
    catch (error) {
        console.error("Lỗi khi tạo account:", error);
        return res.status(500).render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập",
            errorMessage: "Có lỗi xảy ra khi tạo tài khoản"
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
        const accounts = yield account_model_1.default.findOne(find);
        const roles = yield role_model_1.default.find({
            deleted: false,
        });
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            accounts: accounts,
            roles: roles,
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (req.body.email) {
        delete req.body.email;
    }
    if (req.body.password) {
        req.body.password = (0, md5_1.default)(req.body.password);
    }
    else {
        delete req.body.password;
    }
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        yield account_model_1.default.updateOne({ _id: id }, Object.assign(Object.assign({}, req.body), { $push: {
                updatedBy: updatedBy
            } }));
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.editPatch = editPatch;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield account_model_1.default.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
});
exports.deleteItem = deleteItem;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const account = yield account_model_1.default.findOne(find).populate('role_id');
        if ((_a = account === null || account === void 0 ? void 0 : account.createdBy) === null || _a === void 0 ? void 0 : _a.account_id) {
            const user = yield account_model_1.default.findOne({ _id: account.createdBy.account_id });
            if (user) {
                account.accountFullName = user.fullName;
                account.accountEmail = user.email;
            }
        }
        if ((_b = account === null || account === void 0 ? void 0 : account.deletedBy) === null || _b === void 0 ? void 0 : _b.account_id) {
            const deleter = yield account_model_1.default.findById(account.deletedBy.account_id).lean();
            if (deleter) {
                account.deletedBy.accountFullName = deleter.fullName;
                account.deletedBy.accountEmail = deleter.email;
            }
        }
        const updatedBy = (_c = account === null || account === void 0 ? void 0 : account.updatedBy) === null || _c === void 0 ? void 0 : _c.slice(-1)[0];
        if (updatedBy) {
            const userUpdated = yield account_model_1.default.findOne({ _id: updatedBy.account_id });
            if (userUpdated) {
                updatedBy.accountFullName = userUpdated.fullName;
                updatedBy.accountEmail = userUpdated.email;
            }
            else {
                updatedBy.accountFullName = "admin";
                updatedBy.accountEmail = "";
            }
        }
        if (!account) {
            res.redirect(`${config_1.systemConfig.prefixAdmin}/accounts`);
        }
        res.render("admin/pages/accounts/detail", {
            pageTitle: account === null || account === void 0 ? void 0 : account.title,
            account: account,
        });
    }
    catch (error) {
        res.redirect(`${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.detail = detail;
