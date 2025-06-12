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
exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [topics, likedSongs, viewedSongs] = yield Promise.all([
            topic_model_1.default.find({ deleted: false }).sort({ createdAt: -1 }).limit(3),
            song_model_1.default.find({ deleted: false }).sort({ like: -1 }).limit(10),
            song_model_1.default.find({ deleted: false }).sort({ listen: -1 }).limit(10),
        ]);
        const allSingerIds = [
            ...likedSongs.map(song => { var _a; return (_a = song.singerId) === null || _a === void 0 ? void 0 : _a.toString(); }),
            ...viewedSongs.map(song => { var _a; return (_a = song.singerId) === null || _a === void 0 ? void 0 : _a.toString(); }),
        ].filter(Boolean);
        const uniqueSingerIds = [...new Set(allSingerIds)];
        const singers = yield singer_model_1.default.find({
            _id: { $in: uniqueSingerIds },
            deleted: false,
        }).select("fullName avatar slug");
        const singerMap = new Map(singers.map(s => [s._id.toString(), s]));
        const topLikedSongs = likedSongs.map(song => {
            var _a;
            const singer = singerMap.get(((_a = song.singerId) === null || _a === void 0 ? void 0 : _a.toString()) || "");
            return Object.assign(Object.assign({}, song.toObject()), { singer });
        });
        const topViewedSongs = viewedSongs.map(song => {
            var _a;
            const singer = singerMap.get(((_a = song.singerId) === null || _a === void 0 ? void 0 : _a.toString()) || "");
            return Object.assign(Object.assign({}, song.toObject()), { singer });
        });
        res.render("client/pages/home/index", {
            pageTitle: "Trang chủ",
            topics,
            topLikedSongs,
            topViewedSongs,
        });
    }
    catch (error) {
        console.error("Lỗi khi tải trang chủ:", error);
        res.status(500).send("Server error");
    }
});
exports.index = index;
