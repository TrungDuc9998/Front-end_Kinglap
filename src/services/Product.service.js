import axios from "axios";
import httClient from "../http-common"

const getAll = () => {
    return httClient.get('/products/all')
}



export default {getAll}