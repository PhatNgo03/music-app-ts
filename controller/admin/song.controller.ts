import { Request, Response } from "express";
import Account from "../../models/account.model";
import filterStatus from "../../helpers/filterStatus";
import search from "../../helpers/search";
import paginate from "../../helpers/pagination";
import { SortOrder } from "mongoose";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";


// [GET] /admin/songs
export const index = async (req: Request, res: Response) => {
  const query = req.query as { status?: string };
  let filter = filterStatus({ status: query.status ?? "active" });

  let find: any = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = search(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Phân trang
  const countSingers = await Song.countDocuments(find);
  let objectPagination = paginate(
    {
      currentPage: 1,
      limitItems: 4,
      skip: 0,
      totalPage: 0,
    },
    req.query,
    countSingers
  );

  const sort: Record<string, SortOrder> = {};
  const sortKey = req.query.sortKey;
  const sortValue = req.query.sortValue;

  if (
    typeof sortKey === 'string' &&
    typeof sortValue === 'string' &&
    ['asc', 'desc', '1', '-1'].includes(sortValue)
  ) {
    sort[sortKey] = sortValue as SortOrder;
  } else {
    sort['createdAt'] = 'desc';
  }

  const records = await Song.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .lean();

  // Lấy thông tin người tạo
  for (const song of records) {
    if (song.createdBy?.account_id) {
      const user = await Account.findById(song.createdBy.account_id).lean();
      if (user) {
        (song as any).accountFullName = user.fullName;
        (song as any).accountEmail = user.email;
      } else {
        (song as any).accountFullName = "admin";
        (song as any).accountEmail = "";
      }
    }
    // Ca sĩ
    if(song.singerId){
      const singer = await Singer.findById(song.singerId).lean();
      (song as any).singerName  = singer?.fullName || "";
    }

     // Chủ đề
    if (song.topicId) {
      const topic = await Topic.findById(song.topicId).lean();
      (song as any).titleTopic = topic?.title || "N/A";
    }
  }

  res.render("admin/pages/songs/index.pug", {
    pageTitle: "Danh sách bài hát",
    records: records,
    filter: filter,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
};


// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {

  const song = await Song.find({
    deleted :false
  })
  
  const topics = await Topic.find({
    deleted :false,
    status: "active",
  }).select("title avatar");

  const singers = await Singer.find({
    deleted :false,
    status: "active",
  }).select("fullName avatar");

  res.render("admin/pages/songs/create.pug", {
      pageTitle: "Tạo mới bài hát",
      song: song,
      topics: topics,
      singers: singers
  })
}

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.user.id
    };
    if(req.body.position == ""){
      const count= await Song.countDocuments();
      req.body.position = count + 1;
    }
    else{
      req.body.position= parseInt(req.body.position);
    }
    
    //Kiểm tra đang lưu dưới dạng 1 mảng thì lấy phần tử đầu tiên 
    req.body.avatar = Array.isArray(req.body.avatar) ? req.body.avatar[0] : req.body.avatar;
    req.body.audio = Array.isArray(req.body.audio) ? req.body.audio[0] : req.body.audio;  

    //C1
    // const record = new Song(req.body);
    // await record.save();

    //C2
      const dataSong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        avatar: req.body.avatar,
        audio: req.body.audio,
        createdBy: req.body.createdBy,
        position: req.body.position,
        lyrics: req.body.lyrics
    };

    const song = new Song(dataSong);
    await song.save();

    return res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  } catch (error) {
    console.error("Lỗi khi tạo bài hát:", error);

    const topics = await Topic.find({
      deleted: false,
      status: "active",
    }).select("title avatar");

    const singers = await Singer.find({
      deleted: false,
      status: "active",
    }).select("fullName avatar");

    return res.status(500).render("admin/pages/songs/create.pug", {
      pageTitle: "Tạo mới bài hát",
      topics,
      singers
    });
  }
};

// [PATCH] /admin/songs/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const status = req.params.status;
  const id = req.params.id;

  await Song.updateOne(
    { _id: id },
    {
      status: status,
      $push: {
        updatedBy: {
          account_id: res.locals.user.id,
          updatedAt: new Date()
        }
      }
    }
  );

  res.redirect(`/admin/songs`);
};


// [PATCH] /admin/songs/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  const type = req.body.type;
  const ids = (req.body.ids as string)
    .split(",")
    .map((id: string) => id.trim())
    .filter((id: string) => id !== "");

  const adminId = res.locals.user?.id;

  if (!adminId) {
    res.status(401).send("Unauthorized");
  }

  if (ids.length === 0) {
    res.redirect(`/admin/singers`);
  }

  const updateCommon = {
    $push: {
      updatedBy: {
        account_id: adminId,
        updatedAt: new Date(),
      },
    },
  };

  switch (type) {
    case "active":
      await Song.updateMany(
        { _id: { $in: ids } },
        { ...updateCommon, status: "active" }
      );
      break;

    case "inactive":
      await Song.updateMany(
        { _id: { $in: ids } },
        { ...updateCommon, status: "inactive" }
      );
      break;

    case "delete-all":
      await Song.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: adminId,
            deletedAt: new Date(),
          },
          ...updateCommon
        }
      );
      break;

    default:
      break;
  }

  res.redirect(`/admin/songs`);
};



// [GET] /admin/songs/edit/:"id"
export const edit =  async(req: Request, res: Response) => {
  try{
  
  const id = req.params.id;

  const songs = await Song.findOne({
    _id: id,
    deleted : false
  });
  
  const topics = await Topic.find({
    deleted: false,
  }).select("title avatar");

  const singers = await Singer.find({
    deleted: false,
  }).select("fullName");

  res.render("admin/pages/songs/edit", {
    pageTitle: "Chỉnh sửa bài hát",
    songs: songs,
    topics: topics,
    singers : singers
  });
  } catch(error){
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  }
};

// [PATCH] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    req.body.updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    if (req.body.position !== "") {
      req.body.position = parseInt(req.body.position);
    }
    
    req.body.avatar = Array.isArray(req.body.avatar) ? req.body.avatar[0] : req.body.avatar;
    req.body.audio = Array.isArray(req.body.audio) ? req.body.audio[0] : req.body.audio;

    await Song.updateOne(
      { _id: id },
      {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        avatar: req.body.avatar,
        audio: req.body.audio,
        position: req.body.position,
        lyrics: req.body.lyrics,
        $push: {
          updatedBy: req.body.updatedBy
        }
      }
    );

    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  } catch (error) {
    console.error("Lỗi cập nhật bài hát:", error);
    res.status(500).send("Đã có lỗi xảy ra khi cập nhật bài hát");
  }
};