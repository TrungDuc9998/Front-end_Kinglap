import { makeAutoObservable } from "mobx";
import { getDiscount, pagingDiscounts, createDiscount, deleteDiscount, editDiscount} from './DiscountService';
export default class DiscountStore {
    discountList=[];
    totalElements = 0;
    totalPages = 0;
    page = 1;
    rowsPerPage = 10;
    keyword = "";
    constructor() {
        makeAutoObservable(this);
      }
    handleListDiscount = (discount) => {
        this.discountList = discount;
      };
    getDiscounts = async () => {
            let searchObject = {
            page: this.page,
            limit: this.rowsPerPage,
            // keyword:this.keyword
        }
          try {
            let data = await pagingDiscounts(searchObject);
            console.log(data.data.data.data)
            this.handleListDiscount(data.data.data.data);
            this.totalElements=data.data.data.total;
            this.totalPages=data.data.data.last_page;
          } catch (error) {
            console.log(error);
          }
    };

    createDiscounts = async (discount) => {
      try {
        let response = await createDiscount(discount);
        if (response.data) {
          console.log(response.data)
          window.alert('Add success!')
          this.getDiscounts()
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };

    editDiscounts = async (discount) => {
      try {
        let response = await editDiscount(discount);
        if (response.data.data) {
          console.log(response.data.data)
          this.getDiscounts()
          window.alert('Update success!')
         
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleConfirmDelete = async (id) => {
      try {
        await deleteDiscount(id);
        window.alert('Delete success!')
        this.getDiscounts()
      } catch (error) {
        console.log(error);
      }
    };

    setPage = (page) => {
        this.page = page;
        this.updatePageData();
    };

    handleChangeRowsPerPage = (event) => {
    this.rowsPerPage = parseInt(event.target.value, 10);
    this.page = 0;
    this.getDiscounts();
    };

    handleChangePage = (event, newPage) => {
    this.setPage(newPage);
    this.getDiscounts();
    };

    changePageClick = (event, data) => {
      console.log(data)
      this.page=data-1;
      this.getDiscounts();
    };

    updatePageData = (item) => {
      if (item != null) {
        this.page = 0;
        this.keyword = item;
        this.search();
      } else {
        this.search();
      }
    };
    

    search = async () => {
      var searchObject = {
        // keyword: this.keyword,
        page: this.page,
        limit: this.rowsPerPage,
      };
  
      try {
        let data = await pagingDiscounts(searchObject);
        console.log(data.data.totalElements)
        this.totalElements = data.data.totalElements;
        this.totalPages=data.data.totalPages;
        console.log(data.data.content)
        this.handleListDiscount(data.data?.content ? data.data?.content : []);
      } catch (error) {
        console.log(error);
      }
    };
  
    
}