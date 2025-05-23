import mongoose from "mongoose";
import slug from "mongoose-slug-updater"; 

mongoose.plugin(slug);

const songSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description : String,
    singerId: String,
    topicId: String,
    like: {
      type: Number,
      default: 0
    },
    listen: {
      type: Number,
      default: 0
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
      type:Boolean,
      default:false
    },
    deletedBy: {
      account_id: String,
      deletedAt:Date
    },
    updatedBy: [
    {
      account_id: String,
      updatedAt:Date
    },
    ]
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema, "songs");

export default Song;
