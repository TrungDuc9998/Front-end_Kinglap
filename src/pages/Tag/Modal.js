import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
//import AddEditForm from "../Forms/FormAddEdit";
import Edit from "./Edit";
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';


function ModalForm(props) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );
  const label = props.buttonLabel;

  let button = "";
  let title = "";

  if (label === "Edit") {
    button = (
      <Button
        variant="contained"
        color="warning"
        size="medium"
        className="btn btn-warning mr-2"
        startIcon={<EditIcon/>}
        onClick={toggle}
        style={{
          float: "left", marginRight: "10px",
          borderRadius: 5,
          backgroundColor: "orange",
      }}
      >
        {label}
      </Button>
    );
    title = "Edit Item";
  } else {
    button = (
      <>
      <Button
          variant="contained"
          color="primary"
          size="medium"
          className="btn btn-success mr-2"
          onClick={toggle}
          startIcon={<AddCircleIcon/>}
          style={{
            float: "left", marginRight: "10px",
            borderRadius: 5,
            backgroundColor: "green",
        }}
      >
        {label}
      </Button>
      </>
    );
    title = "Add New Item";
  }

  return (
    <div >
      {button}
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={props.className}
        backdrop={"static"}
        keyboard={false}
      >
        <div>
        <ModalHeader className="text-danger" toggle={toggle} close={closeBtn}>
          {title}
        </ModalHeader>
        <ModalBody>
        
          <Edit
            addItemToState={props.addItemToState}
            updateState={props.updateState}
            toggle={toggle}
            item={props.item}
          />
        </ModalBody>
        </div>
      </Modal>
    </div>
  );
}

export default ModalForm;
