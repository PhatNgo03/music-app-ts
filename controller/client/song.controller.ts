import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /songs/:slugRTopic
export const list = async (req: Request, res: Response) => {
  try {
    // Lấy ra thông tin của chủ đề bài hát
    const topic = await Topic.findOne({
      slug: req.params.slugTopic,
      status: "active",
      deleted: false
    });
    //Lấy ra danh sách các bài hát thuộc chủ đề 
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

      (song as any).infoSinger = infoSinger;
    }
    res.render("client/pages/songs/list.pug", {
      pageTitle: topic?.title,
      songs: songs
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
    }).select("title audio avatar singerId topicId description like lyrics");

    const singer = await Singer.findOne({
      _id: song?.singerId,
      deleted: false
    }).select("fullName avatar slug");

    const topic = await Topic.findOne({
      _id: song?.topicId,
      deleted: false
    }).select("title avatar description slug");

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
