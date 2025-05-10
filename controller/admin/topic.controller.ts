import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { tree } from "../../helpers/createTree"
import { systemConfig } from "../../config/config";
import filterStatus from "../../helpers/filterStatus";
import search from "../../helpers/search";
import paginate from "../../helpers/pagination";
import { SortOrder } from "mongoose";

// [GET] /admin/topics
export const index =  async(req: Request, res: Response) => {
  //filterStatus
  const query = req.query as { status?: string };
  let filter = filterStatus({ status: query.status ?? "active" });
  
  // If filter is not an array, set a default value
  if (!Array.isArray(filter)) {
    filter = [];
  }

  let find = {
    deleted : false
  }
  //statusTopics
  if (req.query.status) {
    (find as any).status = req.query.status;
  }
  
  //keyword search
  const objectSearch = search(req.query);
  if(objectSearch.regex){
    (find as any).title = objectSearch.regex;
  }


  //Pagination 
  const countTopics= await Topic.countDocuments(find);
  let objectPagination = paginate(
    {
      currentPage : 1,
      limitItems: 4,
      skip: 0,
      totalPage: 0,
    },
    req.query,
    countTopics
  )


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
    sort['position'] = 'desc';
  }
  //End sort

  
  const topics = await Topic.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems).skip(objectPagination.skip);

  // console.log(products);
  res.render("admin/pages/topics/index.pug", {
    pageTitle: "Trang danh sách chủ đề",
    topics : topics,
    filter: filter,
    keyword: objectSearch.keyword,
    pagination : objectPagination
})
}

// [GET] /admin/topics/create
export const create =  async(req: Request, res: Response) => {
  try {
    let find = {
      deleted: false
    } 
    const records = await Topic.find(find);
    const newRecords = tree(records);
    res.render("admin/pages/topics/create.pug", {
      pageTitle: "Tạo chủ đề bài hát",
      records : newRecords
  })
  } catch (error) {
    res.status(500).send("Server error");
  }
 

 
}
// [POST] /admin/topics/create
export const createPost =  async(req: Request, res: Response) => {
  if(req.body.position == ""){
    const count= await Topic.countDocuments();
    req.body.position = count + 1;
  }
  else{
    req.body.position= parseInt(req.body.position);
  }
  const record = new Topic(req.body);
  await record.save();
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);

}



// [PATCH] /admin/products/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await Topic.updateOne({ _id : id }, {
    status : status,
  });

  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  console.log("IDs received:", req.body.ids);
  switch(type){
    case "active":
      await Topic.updateMany({_id : {$in: ids}}, {
        status: "active",
       });
      break;
    
    case "inactive":
      await Topic.updateMany({_id : {$in: ids}}, {
        status: "inactive",
      });
      break

    case "delete-all":
    await Topic.updateMany(
      {
        _id : {$in: ids}
      },
      {
        deleted: true,
      });
    break;

    case "change-position":
      for(const item of ids){
        let[id, position] = item.split("-");
        position = parseInt(position);
        await Topic.updateOne({ _id: id}, {
          position : position,
        });
      }
      break
    default:
      break;
  }
  
  res.redirect(`/admin/topics`);
}