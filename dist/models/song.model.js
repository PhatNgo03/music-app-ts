"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const songSchema = new mongoose_1.default.Schema({
    title: String,
    avatar: String,
    description: String,
    singerId: String,
    topicId: String,
    like: {
        type: Number,
        default: 0
    },
    likeList: {
        type: [String],
        default: []
    },
    listen: {
        type: Number,
        default: 0
    },
    listenList: {
        type: [String],
        default: []
    },
    position: Number,
    lyrics: String,
    audio: String,
    status: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ]
}, {
    timestamps: true
});
const Song = mongoose_1.default.model("Song", songSchema, "songs");
exports.default = Song;
