import axios from "axios";
const API_PATH_2 = "http://localhost:8080/api/discount";

export const pagingDiscounts = (searchObject) => {
  var url = API_PATH_2 ;
  const config = { params: {limit: searchObject.limit, page: searchObject.page } };
  return axios.get(url, config);
};

export const getDiscount = (id) => {
  let url = API_PATH_2 + "/" + id;
  return axios.get(url);
};

export const createDiscount = (obj) => {
  let url = API_PATH_2;
  return axios.post(url, obj);
};

export const editDiscount = (obj) => {
  let url = API_PATH_2 + "/" + obj.id;
  return axios.put(url, obj);
};

export const deleteDiscount = (id) => {
  let url = API_PATH_2 + "/" + id;
  return axios.delete(url);
};
// export const checkCode = (id, code) => {
//   const config = { params: { id: id, code: code } };
//   var url = API_PATH_2 + "/checkCode";
//   return axios.get(url, config);
// };

