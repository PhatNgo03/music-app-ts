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
exports.detail = exports.deleteItem = exports.editPatch = exports.edit = exports.changeMulti = exports.changeStatus = exports.createPost = exports.create = exports.index = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const config_1 = require("../../config/config");
const dayjs_1 = __importDefault(require("dayjs"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const query = req.query;
    let filter = (0, filterStatus_1.default)({ status: (_a = query.status) !== null && _a !== void 0 ? _a : "active" });
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const countSingers = yield song_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 4,
        skip: 0,
        totalPage: 0,
    }, req.query, countSingers);
    const sort = {};
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if (typeof sortKey === 'string' &&
        typeof sortValue === 'string' &&
        ['asc', 'desc', '1', '-1'].includes(sortValue)) {
        sort[sortKey] = sortValue;
    }
    else {
        sort['createdAt'] = 'desc';
    }
    const records = yield song_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .lean();
    for (const song of records) {
        if ((_b = song.createdBy) === null || _b === void 0 ? void 0 : _b.account_id) {
            const user = yield account_model_1.default.findById(song.createdBy.account_id).lean();
            if (user) {
                song.accountFullName = user.fullName;
                song.accountEmail = user.email;
            }
            else {
                song.accountFullName = "admin";
                song.accountEmail = "";
            }
        }
        if (song.singerId) {
            const singer = yield singer_model_1.default.findById(song.singerId).lean();
            song.singerName = (singer === null || singer === void 0 ? void 0 : singer.fullName) || "";
        }
        if (song.topicId) {
            const topic = yield topic_model_1.default.findById(song.topicId).lean();
            song.titleTopic = (topic === null || topic === void 0 ? void 0 : topic.title) || "N/A";
        }
    }
    res.render("admin/pages/songs/index.pug", {
        pageTitle: "Danh sách bài hát",
        records: records,
        filter: filter,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield song_model_1.default.find({
        deleted: false
    });
    const topics = yield topic_model_1.default.find({
        deleted: false,
        status: "active",
    }).select("title avatar");
    const singers = yield singer_model_1.default.find({
        deleted: false,
        status: "active",
    }).select("fullName avatar");
    res.render("admin/pages/songs/create.pug", {
        pageTitle: "Tạo mới bài hát",
        song: song,
        topics: topics,
        singers: singers
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.createdBy = {
            account_id: res.locals.user.id
        };
        if (req.body.position == "") {
            const count = yield song_model_1.default.countDocuments();
            req.body.position = count + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        req.body.avatar = Array.isArray(req.body.avatar) ? req.body.avatar[0] : req.body.avatar;
        req.body.audio = Array.isArray(req.body.audio) ? req.body.audio[0] : req.body.audio;
        const dataSong = {
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            status: req.body.status,
            avatar: req.body.avatar,
            audio: req.body.audio,
            createdBy: req.body.createdBy,
            position: req.body.position,
            lyrics: req.body.lyrics
        };
        const song = new song_model_1.default(dataSong);
        yield song.save();
        return res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
    catch (error) {
        console.error("Lỗi khi tạo bài hát:", error);
        const topics = yield topic_model_1.default.find({
            deleted: false,
            status: "active",
        }).select("title avatar");
        const singers = yield singer_model_1.default.find({
            deleted: false,
            status: "active",
        }).select("fullName avatar");
        return res.status(500).render("admin/pages/songs/create.pug", {
            pageTitle: "Tạo mới bài hát",
            topics,
            singers
        });
    }
});
exports.createPost = createPost;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield song_model_1.default.updateOne({ _id: id }, {
        status: status,
        $push: {
            updatedBy: {
                account_id: res.locals.user.id,
                updatedAt: new Date()
            }
        }
    });
    res.redirect(`/admin/songs`);
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const type = req.body.type;
    const ids = req.body.ids
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");
    const adminId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!adminId) {
        res.status(401).send("Unauthorized");
    }
    if (ids.length === 0) {
        res.redirect(`/admin/singers`);
    }
    const updateCommon = {
        $push: {
            updatedBy: {
                account_id: adminId,
                updatedAt: new Date(),
            },
        },
    };
    switch (type) {
        case "active":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, Object.assign(Object.assign({}, updateCommon), { status: "active" }));
            break;
        case "inactive":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, Object.assign(Object.assign({}, updateCommon), { status: "inactive" }));
            break;
        case "delete-all":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, Object.assign({ deleted: true, deletedBy: {
                    account_id: adminId,
                    deletedAt: new Date(),
                } }, updateCommon));
            break;
        default:
            break;
    }
    res.redirect(`/admin/songs`);
});
exports.changeMulti = changeMulti;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const songs = yield song_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        const topics = yield topic_model_1.default.find({
            deleted: false,
        }).select("title avatar");
        const singers = yield singer_model_1.default.find({
            deleted: false,
        }).select("fullName");
        res.render("admin/pages/songs/edit", {
            pageTitle: "Chỉnh sửa bài hát",
            songs: songs,
            topics: topics,
            singers: singers
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        req.body.updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        if (req.body.position !== "") {
            req.body.position = parseInt(req.body.position);
        }
        req.body.avatar = Array.isArray(req.body.avatar) ? req.body.avatar[0] : req.body.avatar;
        req.body.audio = Array.isArray(req.body.audio) ? req.body.audio[0] : req.body.audio;
        yield song_model_1.default.updateOne({ _id: id }, {
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            status: req.body.status,
            avatar: req.body.avatar,
            audio: req.body.audio,
            position: req.body.position,
            lyrics: req.body.lyrics,
            $push: {
                updatedBy: req.body.updatedBy
            }
        });
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
    catch (error) {
        console.error("Lỗi cập nhật bài hát:", error);
        res.status(500).send("Đã có lỗi xảy ra khi cập nhật bài hát");
    }
});
exports.editPatch = editPatch;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield song_model_1.default.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
});
exports.deleteItem = deleteItem;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const song = yield song_model_1.default.findOne({
            _id: req.params.id,
            deleted: false,
        }).lean();
        if (song === null || song === void 0 ? void 0 : song.lyrics) {
            song.cleanedLyrics = song.lyrics.replace(/\[\d{2}:\d{2}(?:\.\d{2})?\]/g, "");
        }
        if (!song) {
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
        }
        if ((_a = song === null || song === void 0 ? void 0 : song.createdBy) === null || _a === void 0 ? void 0 : _a.account_id) {
            const user = yield account_model_1.default.findById(song.createdBy.account_id).lean();
            if (user) {
                song.accountFullName = user.fullName;
                song.accountEmail = user.email;
            }
        }
        if ((_b = song === null || song === void 0 ? void 0 : song.deletedBy) === null || _b === void 0 ? void 0 : _b.account_id) {
            const deleter = yield account_model_1.default.findById(song.deletedBy.account_id).lean();
            if (deleter) {
                song.deletedBy.accountFullName = deleter.fullName;
                song.deletedBy.accountEmail = deleter.email;
            }
        }
        const updatedBy = (_c = song === null || song === void 0 ? void 0 : song.updatedBy) === null || _c === void 0 ? void 0 : _c.slice(-1)[0];
        if (updatedBy === null || updatedBy === void 0 ? void 0 : updatedBy.account_id) {
            const userUpdated = yield account_model_1.default.findById(updatedBy.account_id).lean();
            if (userUpdated) {
                updatedBy.accountFullName = userUpdated.fullName;
                updatedBy.accountEmail = userUpdated.email;
            }
            else {
                updatedBy.updatedBy.accountFullName = "admin";
                updatedBy.updatedBy.accountEmail = "";
            }
        }
        const singer = yield singer_model_1.default.findById(song === null || song === void 0 ? void 0 : song.singerId).lean();
        const topic = yield topic_model_1.default.findById(song === null || song === void 0 ? void 0 : song.topicId).lean();
        song.singerName = (singer === null || singer === void 0 ? void 0 : singer.fullName) || "";
        song.topicTitle = (topic === null || topic === void 0 ? void 0 : topic.title) || "";
        song.createdAtFormatted = (0, dayjs_1.default)(song === null || song === void 0 ? void 0 : song.createdAt).format("D/M/YYYY");
        res.render("admin/pages/songs/detail", {
            pageTitle: song === null || song === void 0 ? void 0 : song.title,
            song: song,
            singer: singer,
            topic: topic,
        });
    }
    catch (error) {
        console.error("Lỗi khi lấy chi tiết bài hát:", error);
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.detail = detail;
