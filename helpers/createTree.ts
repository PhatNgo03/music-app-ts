let count = 0;

const createTree = (arr: any[], parentId: string = ""): any[] => {
  const tree: any[] = [];

  arr.forEach((item) => {
    if ((item.parent_id ?? "").toString() === parentId) {
      count++;
      // clone object plain
      const newItem: any = { ...item, index: count };

      // đệ quy tìm con
      const children = createTree(arr, item._id.toString());
      if (children.length > 0) {
        newItem.children = children;
      }

      tree.push(newItem);
    }
  });

  return tree;
};

export const tree = (arr: any[], parentId: string = ""): any[] => {
  count = 0;
  return createTree(arr, parentId);
};
