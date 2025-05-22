import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Account from "../../models/account.model";
import { systemConfig } from "../../config/config";
import filterStatus from "../../helpers/filterStatus";
import search from "../../helpers/search";
import paginate from "../../helpers/pagination";
import mongoose, { SortOrder } from "mongoose";


// [GET] /admin/singers
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
    find.fullName = objectSearch.regex;
  }

  // Phân trang
  const countSingers = await Singer.countDocuments(find);
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

  const records = await Singer.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .lean();

  // Lấy thông tin người tạo
  for (const singer of records) {
    if (singer.createdBy?.account_id) {
      const user = await Account.findById(singer.createdBy.account_id).lean();
      if (user) {
        (singer as any).accountFullName = user.fullName;
        (singer as any).accountEmail = user.email;
      } else {
        (singer as any).accountFullName = "admin";
        (singer as any).accountEmail = "";
      }
    }
  }

  res.render("admin/pages/singers/index.pug", {
    pageTitle: "Danh sách ca sĩ",
    records: records,
    filter: filter,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {

  const singer = await Singer.find({
    deleted :false
  })
  res.render("admin/pages/singers/create.pug", {
      pageTitle: "Tạo mới thông tin ca sĩ",
      singer: singer,
  })
}

// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.user.id
    };

    const record = new Singer(req.body);
    await record.save();

    return res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    console.error("Lỗi khi tạo ca sĩ:", error);
    return res.status(500).render("admin/pages/singers/create.pug", {
      pageTitle: "Tạo mới ca sĩ",
      errorMessage: "Có lỗi xảy ra khi tạo ca sĩ"
    });
  }
};


// [GET] /admin/singers/edit/:"id"
export const edit =  async(req: Request, res: Response) => {
  try{
  const find = {
    deleted : false,
    _id: req.params.id
  }
  const singers = await Singer.findOne(find);

  res.render("admin/pages/singers/edit", {
    pageTitle: "Chỉnh sửa tài khoản",
    singers: singers,
  });
  } catch(error){
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  }
};

// [PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {

  try {
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await Singer.updateOne({ _id: id }, {
      ...req.body,
      $push:{
        updatedBy: updatedBy
      }
    });
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// [DELETE] /admin/singers/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Singer.updateOne(
    {_id: id},
    {
      deleted: true,
      deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
    }, 
  );

 res.redirect(`/${systemConfig.prefixAdmin}/singers`);
}


// [GET] /admin/singers/detail/:"id"
export const detail =  async(req: Request, res: Response) => {
  try{
  const find = {
    deleted : false,
    _id: req.params.id
  }
  const singer = await Singer.findOne(find);

  if (singer?.createdBy?.account_id) {
    const user = await Account.findOne({ _id: singer.createdBy.account_id });
    if (user) {
      (singer as any).accountFullName = user.fullName;
      (singer as any).accountEmail = user.email; 
    }
  }
  if (singer?.deletedBy?.account_id) {
    const deleter = await Account.findById(singer.deletedBy.account_id).lean();
    if (deleter) {
      (singer.deletedBy as any).accountFullName = deleter.fullName;
      (singer.deletedBy as any).accountEmail = deleter.email;
    }
  }
  
  const updatedBy = singer?.updatedBy?.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findById(updatedBy.account_id).lean();
      if (userUpdated) {
        (updatedBy as any).accountFullName = userUpdated.fullName;
        (updatedBy as any).accountEmail = userUpdated.email;
      }
    }
    if (!singer) {
      res.redirect(`/${systemConfig.prefixAdmin}/singers`);
    }
    res.render("admin/pages/singers/detail", {
      pageTitle: "Thông tin chi tiết ca sĩ",
      singer: singer,
    });
  } catch(error){
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  }
};

// [PATCH] /admin/singers/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const status = req.params.status;
  const id = req.params.id;

  await Singer.updateOne(
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

  res.redirect(`/admin/singers`);
};


// [PATCH] /admin/topics/change-multi
// export const changeMulti = async (req: Request, res: Response) => {
//   const type = req.body.type;
//   const ids = req.body.ids.split(", ");
//   switch(type){
//     case "active":
//       await Singer.updateMany({_id : {$in: ids}}, {
//         status: "active",
//        });
//       break;
    
//     case "inactive":
//       await Singer.updateMany({_id : {$in: ids}}, {
//         status: "inactive",
//       });
//       break

//     case "delete-all":
//     await Singer.updateMany(
//       {
//         _id : {$in: ids}
//       },
//       {
//         deleted: true,
//       });
//     break;
//     default:
//       break;
//   }
  
//   res.redirect(`/admin/topics`);
// }
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
      await Singer.updateMany(
        { _id: { $in: ids } },
        { ...updateCommon, status: "active" }
      );
      break;

    case "inactive":
      await Singer.updateMany(
        { _id: { $in: ids } },
        { ...updateCommon, status: "inactive" }
      );
      break;

    case "delete-all":
      await Singer.updateMany(
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

  res.redirect(`/admin/singers`);
};

