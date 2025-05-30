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
Object.defineProperty(exports, "__esModule", { value: true });
const validate = {};
validate.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, avatar } = req.body;
    if (!fullName || fullName.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
    }
    if (!avatar || typeof avatar !== "string") {
        return res.status(400).json({ message: "Avatar không hợp lệ!" });
    }
    next();
});
validate.edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName } = req.body;
    if (!fullName || fullName.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
    }
    next();
});
exports.default = validate;
