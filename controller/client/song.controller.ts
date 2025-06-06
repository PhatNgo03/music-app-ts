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

    const user = res.locals.user;

    let isFavorite = false;

    const song = await Song.findOne({
      slug: slugSong,
      status: "active",
      deleted: false
    }).select("title audio avatar singerId topicId description like lyrics listen likeList listenList");

    if (song?.lyrics) {
      (song as any).cleanedLyrics = song.lyrics.replace(/\[\d{2}:\d{2}(?:\.\d{2})?\]/g, "");
    }
    
    const singer = await Singer.findOne({
      _id: song?.singerId,
      deleted: false
    }).select("fullName avatar slug");

    const topic = await Topic.findOne({
      _id: song?.topicId,
      deleted: false
    }).select("title avatar description slug");

    if(user && song){
      const favoriteSong = await FavoriteSong.findOne({
        songId: song.id,
        userId: user._id,
        deleted: false
      });

      isFavorite = !!favoriteSong;
    }
    (song as any).isFavoriteSong = isFavorite;

    let isLiked = false;
    if (user && song) {
      isLiked = song.likeList?.includes(user._id.toString()) ?? false;
    }
    (song as any).isLiked = isLiked;

    res.render("client/pages/songs/detail", {
      pageTitle: "Chi tiết bài hát",
      song,
      singer,
      topic,
      isLiked,
      isFavorite: isFavorite, 
    });
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


export const like = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user; 
    if (!user) {
      res.status(401).json({
        code: 401,
        message: "Bạn cần đăng nhập để thực hiện hành động này."
      });
    }
    const idSong: string = req.params.idSong;
    const typeLike: string = req.params.typeLike;

    const song = await Song.findOne({
      _id: idSong,
      status: "active",
      deleted: false
    });

    let likeList = song?.likeList || [];

    if (typeLike === "like") {
      if (!likeList.includes(user._id.toString())) {
        likeList.push(user._id.toString());
      }
    } else if (typeLike === "dislike") {
      likeList = likeList.filter(id => id !== user._id.toString());
    } else {
      res.status(400).json({ code: 400, message: "Type like không hợp lệ" });
    }

    const newLikeCount = likeList.length;

    await Song.updateOne(
      { _id: idSong },
      {
        like: newLikeCount,
        likeList: likeList
      }
    );
    res.json({
      code: 200,
      message: "Cập nhật like thành công",
      like: newLikeCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const favorite = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(401).json({ code: 401, message: "Vui lòng đăng nhập để yêu thích bài hát" });
    }

    const idSong: string = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite":
        const existFavoriteSong = await FavoriteSong.findOne({
          songId: idSong,
          userId: user._id,
          deleted: false
        });
        if (!existFavoriteSong) {
          const record = new FavoriteSong({
            userId: user._id,
            songId: idSong,
            deleted: false
          });
          await record.save();
        }
        break;
      case "unfavorite":
        await FavoriteSong.deleteOne({
          songId: idSong,
          userId: user._id
        });
        break;
      default:
        res.status(400).json({ code: 400, message: "Type favorite không hợp lệ" });
    }

    res.json({
      code: 200,
      message: "Cập nhật yêu thích bài hát thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};