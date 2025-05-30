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
exports.logout = exports.loginPost = exports.login = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const config_1 = require("../../config/config");
const md5_1 = __importDefault(require("md5"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.token) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập",
        });
    }
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield account_model_1.default.findOne({
        email,
        deleted: false
    });
    if (!user) {
        console.log(`Login failed: Email không tồn tại - Email: ${email}`);
        return res.status(401).render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập",
            errorMessage: "Email không tồn tại"
        });
    }
    if ((0, md5_1.default)(password) !== user.password) {
        console.log(`Login failed: Mật khẩu không đúng - Email: ${email}`);
        return res.status(401).render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập",
            errorMessage: "Mật khẩu không đúng"
        });
    }
    if (user.status === "inactive") {
        console.log(`Login failed: Tài khoản chưa được kích hoạt - Email: ${email}`);
        return res.status(403).render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập",
            errorMessage: "Tài khoản chưa được kích hoạt"
        });
    }
    res.cookie("token", user.token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
    });
    res.redirect(`/admin/dashboard`);
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/auth/login`);
});
exports.logout = logout;
