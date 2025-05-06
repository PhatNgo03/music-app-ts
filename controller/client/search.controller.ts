import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /search/:type
export const result = async (req: Request, res: Response) => {
  try {
    const type= req.params.type;

    const keyword: string  = `${req.query.keyword}`;

    let newSongs: any[] = [];

    if(keyword){
      const keywordRegex = new RegExp(keyword, "i");

      //Tạo ra 1 slug có dấu " - " ngăn cách thay khoảng trắng 
      const stringSlug = convertToSlug(keyword);
      const stringSlugRegex = new RegExp(stringSlug, "i");
      
      const songs = await Song.find({
        $or: [
          { title: keywordRegex }, 
          { slug: stringSlugRegex }
        ],
        deleted: false
      });

      for(const item of songs){
        const infoSinger = await Singer.findOne({
          _id: item.singerId
        });

        // (item as any).infoSinger = infoSinger;
        newSongs.push({
          id: item.id,
          title: item.title,
          avatar: item.avatar,
          like: item.like,
          slug: item.slug,
          infoSinger: {
            fullName: infoSinger?.fullName
          }
        })
      }
      // newSongs = songs;
    }
    switch (type){
      case "result":
        res.render("client/pages/search/result", {
          pageTitle: `Kết quả : ${keyword}`,
          keyword: keyword,
          songs: newSongs
        });
        break;
      case "suggest":
        res.json({
          code:200,
          message: "Thành công!",
          songs: newSongs
        })
        break;
      default:
        res.json({
          code:400,
          message: "Thất bại!",
        });
        break;
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};
