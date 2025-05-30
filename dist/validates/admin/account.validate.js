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
const account_model_1 = __importDefault(require("../../models/account.model"));
const validate = {};
validate.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, phone, avatar } = req.body;
    if (!fullName || fullName.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ!" });
    }
    try {
        const existingAccount = yield account_model_1.default.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi server!" });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
    }
    if (!avatar || typeof avatar !== "string") {
        return res.status(400).json({ message: "Avatar không hợp lệ!" });
    }
    next();
});
validate.edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fullName, email, phone, avatar } = req.body;
    if (!fullName || fullName.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
    }
    try {
        const existingAccount = yield account_model_1.default.findOne({ email });
        if (existingAccount && existingAccount._id.toString() !== id) {
            return res.status(400).json({ message: "Email đã được sử dụng bởi tài khoản khác!" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi server!" });
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
    }
    next();
});
exports.default = validate;
