interface Pagination {
  currentPage: number;
  limitItems: number;
  skip: number;
  totalPage: number;
}

interface Query {
  page?: string;
}

export default function paginate(
  objectPagination: Pagination,
  query: Query,
  countProducts: number
): Pagination {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page, 10);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  objectPagination.totalPage = Math.ceil(countProducts / objectPagination.limitItems);

  return objectPagination;
}
