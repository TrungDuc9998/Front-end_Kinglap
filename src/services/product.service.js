import httpClient from "../http-common";
const getAll = () => {
    return httpClient.get('/products/x');
}


export default { getAll }