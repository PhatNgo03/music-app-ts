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
exports.listen = exports.favorite = exports.like = exports.detail = exports.list = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield topic_model_1.default.findOne({
            slug: req.params.slugTopic,
            status: "active",
            deleted: false
        });
        const validSongs = [];
        const songs = yield song_model_1.default.find({
            topicId: topic === null || topic === void 0 ? void 0 : topic.id,
            status: "active",
            deleted: false
        }).select("avatar title slug singerId like");
        for (const song of songs) {
            const infoSinger = yield singer_model_1.default.findOne({
                _id: song.singerId,
                status: "active",
                deleted: false
            });
            if (infoSinger) {
                song.infoSinger = infoSinger;
                validSongs.push(song);
            }
        }
        res.render("client/pages/songs/list.pug", {
            pageTitle: topic === null || topic === void 0 ? void 0 : topic.title,
            songs: validSongs
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugSong = req.params.slugSong;
        const song = yield song_model_1.default.findOne({
            slug: slugSong,
            status: "active",
            deleted: false
        }).select("title audio avatar singerId topicId description like lyrics listen");
        if (song === null || song === void 0 ? void 0 : song.lyrics) {
            song.cleanedLyrics = song.lyrics.replace(/\[\d{2}:\d{2}(?:\.\d{2})?\]/g, "");
        }
        const singer = yield singer_model_1.default.findOne({
            _id: song === null || song === void 0 ? void 0 : song.singerId,
            deleted: false
        }).select("fullName avatar slug");
        const topic = yield topic_model_1.default.findOne({
            _id: song === null || song === void 0 ? void 0 : song.topicId,
            deleted: false
        }).select("title avatar description slug");
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            songId: song === null || song === void 0 ? void 0 : song.id,
        });
        song.isFavoriteSong = favoriteSong ? true : false;
        res.render("client/pages/songs/detail", {
            pageTitle: "Chi tiết bài hát",
            song,
            singer,
            topic
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const idSong = req.params.idSong;
        const typeLike = req.params.typeLike;
        const song = yield song_model_1.default.findOne({
            _id: idSong,
            status: "active",
            deleted: false
        });
        const newLike = typeLike === "like" ? ((_a = song === null || song === void 0 ? void 0 : song.like) !== null && _a !== void 0 ? _a : 0) + 1 : ((_b = song === null || song === void 0 ? void 0 : song.like) !== null && _b !== void 0 ? _b : 0) - 1;
        yield song_model_1.default.updateOne({
            _id: idSong,
        }, {
            like: newLike
        });
        res.json({
            code: 200,
            message: "Like thành công!",
            like: newLike
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const typeFavorite = req.params.typeFavorite;
        switch (typeFavorite) {
            case "favorite":
                const existFavoriteSong = yield favorite_song_model_1.default.findOne({
                    songId: idSong,
                });
                if (!existFavoriteSong) {
                    const record = new favorite_song_model_1.default({
                        songId: idSong
                    });
                    yield record.save();
                }
                break;
            case "unfavorite":
                yield favorite_song_model_1.default.deleteOne({
                    songId: idSong
                });
                break;
        }
        res.json({
            code: 200,
            message: "Yêu thích bài hát thành công!",
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const idSong = req.params.idSong;
        const song = yield song_model_1.default.findOne({
            _id: idSong,
            status: "active",
            deleted: false
        });
        const listen = ((_a = song === null || song === void 0 ? void 0 : song.listen) !== null && _a !== void 0 ? _a : 0) + 1;
        yield song_model_1.default.updateOne({
            _id: idSong,
        }, {
            listen: listen
        });
        const songNew = yield song_model_1.default.findOne({
            _id: idSong
        });
        res.json({
            code: 200,
            message: "Thành công!",
            listen: songNew === null || songNew === void 0 ? void 0 : songNew.listen
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});
exports.listen = listen;
