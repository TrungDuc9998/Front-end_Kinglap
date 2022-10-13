import React, { useState, useEffect } from "react";
import { getDiscount} from './DiscountService';
import { Formik, Field,Form, ErrorMessage } from 'formik';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import * as Yup from 'yup';
import moment from "moment";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
function Edit(props) {
  const [form, setValues] = useState({
    id:null,
    name:"",
    ratio:null,
    startDate:"2021-09-09 09:09:09",
    endDate:"2021-09-09 10:09:09",
    active:1,
  });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleChange =(e) => {
    setValues({...form,
      active:e.target.value
    });
  };

  const submitFormAdd = (e) => {
    console.log(form);
    //e.preventDefault();
    props.addItemToState(form);
    props.toggle();
  };

  const submitFormEdit = (e) => {
    //e.preventDefault();
    props.updateState(form);
    props.toggle();
  };
  console.log('log',form)

  const validationSchema=Yup.object({
    name: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Name is required'),
    ratio: Yup.number().min(0,"Giá trị thấp nhất là 0").required("Không được để trống").nullable(),
    startDate: Yup.date()
    .transform(function transformDate(castValue, originalValue) {
      return originalValue ? new Date(originalValue) : castValue;
    })
    .typeError("Thời gian không đúng định dạng")
    .required("Không được để trống")
    .nullable(),
    endDate: Yup.date()
    .test(
      "is-greater-time",
      "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      function (value) {
        if (form && value) {
          let startDate = moment(form?.startDate).format("dd-MM-yyyy HH:mm:ss");
          let endDate = moment(form?.endDate).format("dd-MM-yyyy HH:mm:ss");
          if (startDate <= endDate) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
    )
    .transform(function transformDate(castValue, originalValue) {
      return originalValue ? new Date(originalValue) : castValue;
    })
    .typeError("Thời gian không đúng định dạng")
    .required("Không được để trống")
    .nullable(),
    })
    

    async function getDiscounts(itemId) {
      let response = await getDiscount(itemId);
      if (response.data) {
        console.log('getId',response.data)
        setValues(response.data.data)
      } 
    } 

  useEffect(() => {
    if (props.item) {
      getDiscounts(props.item.id)

    }
  }, [props.item]);
      return (
        <Formik
                initialValues={form}
                validationSchema={validationSchema}
                enableReinitialize
                onChange={onChange}
                onSubmit={props.item ? submitFormEdit : submitFormAdd}
                
                >{({ errors, status, touched }) => (
                  <Form>
                     <div className="form-group">
                          <label htmlFor="name">Tiêu đề</label>
                          <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} value={form.name=== null ? "" :form.name} onChange={onChange}/>
                          <ErrorMessage name="name" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="ratio">Tỉ lệ</label>
                          <Field name="ratio" type="number" className={'form-control' + (errors.ratio && touched.ratio ? ' is-invalid' : '')} value={form.ratio=== null ? "" :form.ratio} onChange={onChange}/>
                          <ErrorMessage name="ratio" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="startDate">Ngày bắt đầu</label>
                          <Field name="startDate" type="datetime" className={'form-control' + (errors.startDate && touched.startDate ? ' is-invalid' : '')} value={form.startDate=== null ? "" :form.startDate} onChange={onChange}/>
                          <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="endDate">Ngày kết thúc</label>
                          <Field name="endDate" type="datetime" className={'form-control' + (errors.endDate && touched.endDate ? ' is-invalid' : '')} value={form.endDate=== null ? "" :form.endDate} onChange={onChange}/>
                          <ErrorMessage name="endDate" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="active">Trạng thái</label>
                          <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={form.active== 1 ? 1 :0}
                                onChange={handleChange}
                                className={'form-control' + (errors.active && touched.active ? ' is-invalid' : '')} 
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Hoạt động" />
                                <FormControlLabel value={0} control={<Radio />} label="Không hoạt động" />
                            </RadioGroup>
                          <ErrorMessage name="active" component="div" className="invalid-feedback" />
                      </div>
                  <div className="form-group">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    className="btn btn-primary mr-2"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    color="secondary"
                    size="large"
                    className="btn"
                    startIcon={<RotateLeftIcon/>}
                  >
                    Reset
                  </Button>
                  </div>
                </Form>
                )}
            </Formik>

      )}
    
  
  
  export default Edit