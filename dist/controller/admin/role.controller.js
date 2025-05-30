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
exports.permissionsPatch = exports.permissions = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const config_1 = require("../../config/config");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const records = yield role_model_1.default.find(find);
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("admin/pages/roles/create.pug", {
            pageTitle: "Tạo mới nhóm quyền",
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = new role_model_1.default(req.body);
    yield record.save();
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const roles = yield role_model_1.default.findOne(find);
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            roles: roles,
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield role_model_1.default.updateOne({ _id: id }, req.body);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
});
exports.editPatch = editPatch;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false
        };
        const records = yield role_model_1.default.find(find);
        res.render("admin/pages/roles/permissions", {
            pageTitle: "Phân quyền",
            records: records,
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = JSON.parse(req.body.permissions);
    try {
        for (const item of permissions) {
            yield role_model_1.default.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles/permissions`);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.permissionsPatch = permissionsPatch;
