import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

export const index = async (req: Request, res: Response) => {
  try {
    // Lấy topics và 20 bài hát (10 like, 10 listen)
    const [topics, likedSongs, viewedSongs] = await Promise.all([
      Topic.find({ deleted: false }).sort({ createdAt: -1 }).limit(3),
      Song.find({ deleted: false }).sort({ like: -1 }).limit(10),
      Song.find({ deleted: false }).sort({ listen: -1 }).limit(10),
    ]);

    // Lấy danh sách tất cả singerId từ nhóm bài hát
    const allSingerIds = [
      ...likedSongs.map(song => song.singerId?.toString()),
      ...viewedSongs.map(song => song.singerId?.toString()),
    ].filter(Boolean); // loại bỏ undefined/null

    // Lọc unique
    const uniqueSingerIds = [...new Set(allSingerIds)];

    // Truy vấn danh sách ca sĩ
    const singers = await Singer.find({
      _id: { $in: uniqueSingerIds },
      deleted: false,
    }).select("fullName avatar slug");

    // Map singerId => singer object
    const singerMap = new Map(singers.map(s => [s._id.toString(), s]));

    // Gắn singer vào từng bài hát
    const topLikedSongs = likedSongs.map(song => {
      const singer = singerMap.get(song.singerId?.toString() || "");
      return { ...song.toObject(), singer };
    });

    const topViewedSongs = viewedSongs.map(song => {
      const singer = singerMap.get(song.singerId?.toString() || "");
      return { ...song.toObject(), singer };
    });

    res.render("client/pages/home/index", {
      pageTitle: "Trang chủ",
      topics,
      topLikedSongs,
      topViewedSongs,
    });
  } catch (error) {
    console.error("Lỗi khi tải trang chủ:", error);
    res.status(500).send("Server error");
  }
};
