let count = 0;

const createTree = (arr: any[], parentId: string = ""): any[] => {
  const tree: any[] = [];

  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++;
      const newItem = { ...item }; 
      newItem.index = count;

      const children = createTree(arr, item.id);
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
