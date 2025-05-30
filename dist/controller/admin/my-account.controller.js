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
exports.editPatch = exports.edit = exports.index = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const config_1 = require("../../config/config");
const md5_1 = __importDefault(require("md5"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin cá nhân",
    });
});
exports.index = index;
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
        res.render("admin/pages/my-account/edit.pug", {
            pageTitle: "Chỉnh sửa thông tin cá nhân",
            accounts: accounts,
            roles: roles
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = res.locals.user.id;
    delete req.body.email;
    if (req.body.password) {
        req.body.password = (0, md5_1.default)(req.body.password);
    }
    else {
        delete req.body.password;
    }
    try {
        yield account_model_1.default.updateOne({ _id: id }, req.body);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
});
exports.editPatch = editPatch;
