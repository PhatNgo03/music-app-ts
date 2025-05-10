export default (query: { keyword?: string }): { keyword: string; regex?: RegExp } => {
   const objectSearch: { keyword: string; regex?: RegExp } = {
     keyword: "",
   };
 
   if (query.keyword) {
     objectSearch.keyword = query.keyword;
     objectSearch.regex = new RegExp(objectSearch.keyword, "i");
   }
 
   return objectSearch;
 };
 