
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Table } from 'reactstrap';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import ModalForm from './Modal';
import TablePagination from '@material-ui/core/TablePagination';
import Pagination from '@material-ui/lab/Pagination';
import { useStore } from "../../store";

export default observer(function Discount() {
  const {discountStore}=useStore();
  const {
    discountList,
    page,
    rowsPerPage,
    totalElements,
    totalPages,
    changePageClick,
    createDiscounts,
    editDiscounts,
    updatePageData,
    handleChangeRowsPerPage,
    getDiscounts, 
    setPage, 
    handleChangePage,
    handleListDiscount,
    handleConfirmDelete
    }=discountStore;
  const [searchChange, setSearchChange] = React.useState('');

  useEffect(() => {
    getDiscounts()
  }, []);

  const addItemToState = (item1) => {
    console.log(item1)
    createDiscounts(item1)
  };


  const updateState = (item) => {
    const itemIndex = discountList.findIndex((data) => data.id === item.id);
    console.log(itemIndex)
    if(itemIndex>-1){
      editDiscounts(item);
    }else{
    }
  };

  const deleteItem = id => {
    let confirmDelete = window.confirm('Delete item forever?')
    if(confirmDelete){
      handleConfirmDelete(id)
    }
  }

  const findChange= event=>{
    const { value } = event.target
    console.log(value)
    setSearchChange(value)
  }

  const searchClick = ()=> {
    console.log('valueSearch', searchChange)
    findItemFromState(searchChange)  
  }

  const findItemFromState = (item1) => {
    updatePageData(item1)
  };

  const handleKeyDownEnterSearch = (event) => {
    if (event.key === "Enter") {
      findItemFromState(searchChange)
    }
  };
  
  return (
      <>
  <h1>Discount</h1>
  <div className="input-group">
    <div className="form-outline">
      <input type="search" name="keyword" id="form1" className="form-control" placeholder="Search" 
      onChange={findChange}
      onKeyPress={handleKeyDownEnterSearch}/>
    </div>
    <button type="button" className="btn btn-primary"
    onClick={() => {searchClick();}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
    </button>
  </div>
  <br></br>
  <ModalForm buttonLabel="Add" item={null} addItemToState={addItemToState}/>
  <br></br>
  <br></br>
  <Table responsive bordered hover>
  <thead class="table-active"> 
    <tr>
      <th>Tiêu đề</th>
      <th>Tỉ lệ</th>
      <th>Ngày bắt đầu</th>
      <th>Ngày kết thúc</th>
      <th>Trạng thái</th>
      <th>Thao tác</th>
    </tr>
  </thead>
  <tbody>
    { discountList.length > 0 ? (
       discountList.map((coun) => (
        <tr key={coun.id}>
          <td>{coun.name}</td>
          <td>{coun.ratio}</td>
          <td>{coun.startDate}</td>
          <td>{coun.endDate}</td>
          <td>
          {coun.active==1&& (
              <div
              className="bg-success text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
            >
              Hoạt động
            </div>
            )}
            {coun.active==0&& (
              <div
              className="bg-warning text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
            >
              Không hoạt động
            </div>
            )}
          </td>
          <td>
              <ModalForm buttonLabel="Edit" item={coun} 
              updateState={updateState}
              >
              </ModalForm>
              <Button
                variant="contained"
                color="secondary"
                className="btn btn-danger"
                style={{
                  float: "right", marginRight: "10px",
                  borderRadius: 5,
                  backgroundColor: "#f50057",
              }}
                startIcon={<DeleteIcon />}
                onClick={() => deleteItem(coun.id)}
              >
                Delete
              </Button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={3}>No record</td>
      </tr>
    )}
  </tbody>
</Table>
<div className="paging">
<TablePagination
    rowsPerPageOptions={[5,10,15,20,25,50,100]}
    component="div"
    count={totalElements}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
  <Pagination count={totalPages} showFirstButton showLastButton onChange={changePageClick}/>
</div>

  </>
  )
})
