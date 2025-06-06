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
exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5 = require("md5");
const crypto_1 = __importDefault(require("crypto"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng ký tài khoản",
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        return res.render("client/pages/user/register.pug", {
            pageTitle: "Đăng ký tài khoản",
            error: "Mật khẩu không khớp",
        });
    }
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email
    });
    if (existEmail) {
        return res.render("client/pages/user/register.pug", {
            pageTitle: "Đăng ký tài khoản",
            error: "Email đã tồn tại",
        });
    }
    req.body.password = md5(req.body.password);
    req.body.tokenUser = crypto_1.default.randomBytes(16).toString("hex");
    const user = new user_model_1.default(req.body);
    yield user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/topics");
});
exports.registerPost = registerPost;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập",
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user || md5(password) !== user.password || user.status === "inactive") {
        return res.redirect("back");
    }
    const newToken = crypto_1.default.randomBytes(16).toString("hex");
    yield user_model_1.default.updateOne({ _id: user._id }, { tokenUser: newToken });
    res.cookie("tokenUser", newToken);
    res.redirect("/topics");
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.updateOne({
        tokenUser: req.cookies.tokenUser
    });
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
});
exports.logout = logout;
