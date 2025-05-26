import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  try {
    // Lấy ra thông tin của chủ đề bài hát
    const topic = await Topic.findOne({
      slug: req.params.slugTopic,
      status: "active",
      deleted: false
    });
    //Lấy ra danh sách các bài hát thuộc chủ đề 
    const validSongs = [];

    const songs = await Song.find({
      topicId: topic?.id,
      status: "active",
      deleted: false
    }).select("avatar title slug singerId like");

    for (const song of songs) {
      const infoSinger = await Singer.findOne({
        _id : song.singerId,
        status: "active",
        deleted: false
      }); 
      if (infoSinger) {
      (song as any).infoSinger = infoSinger;
      validSongs.push(song);
      }

    }
    res.render("client/pages/songs/list.pug", {
      pageTitle: topic?.title,
      songs: validSongs
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};


// [GET] /songs/:slugSong
export const detail = async (req: Request, res: Response) => {
  try {
    const slugSong: string = req.params.slugSong;

    const song = await Song.findOne({
      slug: slugSong,
      status: "active",
      deleted: false
    }).select("title audio avatar singerId topicId description like lyrics listen");

    const singer = await Singer.findOne({
      _id: song?.singerId,
      deleted: false
    }).select("fullName avatar slug");

    const topic = await Topic.findOne({
      _id: song?.topicId,
      deleted: false
    }).select("title avatar description slug");

    const favoriteSong = await FavoriteSong.findOne({
      songId: song?.id,
    });

    (song as any).isFavoriteSong = favoriteSong ? true : false;
    res.render("client/pages/songs/detail", {
      pageTitle: "Chi tiết bài hát",
      song,
      singer,
      topic
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// [patch] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const typeLike: string = req.params.typeLike;
    const song = await Song.findOne({
      _id: idSong,
      status: "active",
      deleted : false
    });

    const newLike: number = typeLike === "like" ? (song?.like ?? 0) + 1 : (song?.like ?? 0) - 1;
    await Song.updateOne(
      {
        _id: idSong,
      },
      {
        like: newLike
      }
    );
    // like :["id_user_1", "id_user_2"] //update when login account
    res.json({
      code: 200,
      message: "Like thành công!",
      like: newLike
    })
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// [patch] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite":
        const existFavoriteSong = await FavoriteSong.findOne({
          songId: idSong,
        });
        if(!existFavoriteSong){
          const record = new FavoriteSong({
            // userId : "",
            songId : idSong
          });
          await record.save();
        }
        break;
      case "unfavorite":
        await FavoriteSong.deleteOne({
          songId: idSong
        });
        break;
    }
    res.json({
      code: 200,
      message: "Yêu thích bài hát thành công!",
    })
  } catch (error) {
    res.status(500).send("Server error");
  }
};


// [patch] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const song = await Song.findOne({
      _id: idSong,
      status: "active",
      deleted : false
    });

    const listen : number =  (song?.listen ?? 0) + 1;

    await Song.updateOne(
      {
        _id: idSong,
      },
      {
        listen: listen
      }
    );
    
    const songNew = await Song.findOne({
      _id : idSong
    })

    res.json({
      code: 200,
      message: "Thành công!",
      listen: songNew?.listen
    })
  } catch (error) {
    res.status(500).send("Server error");
  }
};
