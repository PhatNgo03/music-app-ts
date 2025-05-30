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
    const { title, description, position, lyrics } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập tiêu đề bài hát!" });
    }
    if (!description || description.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập mô tả bài hát!" });
    }
    if (!lyrics || lyrics.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập lời bài hát!" });
    }
    if (position !== undefined && isNaN(Number(position))) {
        return res.status(400).json({ message: "Vị trí phải là số!" });
    }
    next();
});
validate.edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, lyrics, position } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập tiêu đề bài hát!" });
    }
    if (!description || description.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập mô tả bài hát!" });
    }
    if (!lyrics || lyrics.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập lời bài hát!" });
    }
    if (position !== undefined && isNaN(Number(position))) {
        return res.status(400).json({ message: "Vị trí phải là số!" });
    }
    next();
});
exports.default = validate;
