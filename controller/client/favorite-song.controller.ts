import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /favorite-songs/
export const index = async (req: Request, res: Response) => {
  try {
    const favoriteSongs = await FavoriteSong.find({
      // userId : "",
      deleted: false
    })

    for(const item of favoriteSongs){
      //Lay thong tin bai hat
      const infoSong = await Song.findOne({
        _id : item.songId
      });
      //Lay thong tin ca si
      const infoSinger = await Singer.findOne({
        _id : infoSong?.singerId
      });
      (item as any).infoSong = infoSong;
      (item as any).infoSinger = infoSinger;
    }

    res.render("client/pages/favorite-songs/index", {
        pageTitle: "Bài hát yêu thích ",
        favoriteSongs: favoriteSongs
      });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
