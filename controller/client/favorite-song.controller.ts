import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /favorite-songs/
export const index = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.redirect("/auth/login"); 
    }

    const favoriteSongs = await FavoriteSong.find({
      userId: user._id,
      deleted: false,
    });

    for (const item of favoriteSongs) {
      const infoSong = await Song.findOne({ _id: item.songId });

      // Nếu bài hát không tồn tại (bị xóa), bỏ qua item
      if (!infoSong) continue;

      const infoSinger = await Singer.findOne({ _id: infoSong.singerId });

      (item as any).infoSong = infoSong;
      (item as any).infoSinger = infoSinger;
    }

    res.render("client/pages/favorite-songs/index", {
      pageTitle: "Bài hát yêu thích",
      favoriteSongs: favoriteSongs.filter((item: any) => item.infoSong), // lọc bài bị null
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài hát yêu thích:", error);
    res.status(500).send("Server error");
  }
};
