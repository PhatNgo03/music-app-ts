// mot cach de add thu muc tĩnh vào trong (dist) ts để biên dịch qua js 

//add package.json "scripts": { "build": "tsc && node copy-dir.js"}
const fs = require("fs-extra");

const listFolderCopy = [
  {
    sourceDirectory: "views",
    targetDirectory: "dist/views"
  },
  {
    sourceDirectory: "public",
    targetDirectory: "dist/public"
  }
];

listFolderCopy.forEach(item => {
  fs.copy(item.sourceDirectory, item.targetDirectory, (err) => {
    if (err) {
      console.error(`Lỗi sao chép thư mục ${item.sourceDirectory}:`, err);
    } else {
      console.log(`Sao chép thành công thư mục ${item.sourceDirectory}`);
    }
  });
});