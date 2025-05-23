import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    parent_id: {
      type: String,
      default: ""
    },
    description : String,
    status: String,
    slug: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model("Topic", topicSchema, "topics");

export default Topic;
