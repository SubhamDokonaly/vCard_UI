import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductValidation } from "../../../../validations/addUserValidation";
import { AiFillEye, AiOutlineClose } from "react-icons/ai";
import { useCreateUser } from "../../../../hooks/user";
import { useState, useRef } from "react";
import styles from "./index.module.css";
import { CircularProgress } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAddProduct, useUpdateProduct } from "../../../../hooks/admin";
import DeleteIcon from '@mui/icons-material/Delete';

function AddProductDrawer({ onCloseButtonClick, data, isEdit }) {
  const createdBy = localStorage.getItem("allMasterId");
  const defaultValues = {
    name: isEdit ? data.name : "",
    brand: isEdit ? data.brand : "",
    price: isEdit ? data.price : "",
    discount: isEdit ? data.discount : "",
    description: isEdit ? data.description : "",
    image: isEdit ? data.image : null,
    status: isEdit ? data.status : 1
  };
  const inputRef = useRef();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(addProductValidation),
    mode: "onTouched",
    defaultValues,
  });
  const [alignment, setAlignment] = useState("left");
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const closePopup = () => {
    onCloseButtonClick()
  }

  const { mutate: addProductMutate, isPending: addProductPending } = useAddProduct(closePopup);
  const { mutate: updateProductMutate, isPending: updateProductPending } = useUpdateProduct(closePopup);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("description", data.description);
    if (isEdit) {
      console.log(createdBy,"")
      formData.append("id", data._id);
      updateProductMutate(formData);
    } else {
      addProductMutate(formData);
    }
  };

  async function uploadHandler(event) {
    setValue("image", event.target.files[0]);
  }

  function removeUploadedFile() {
    setValue("image", null);
  }

  const handleClick = () => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const newTab = window.open();
      newTab.document.write(`<img src="${e.target.result}" alt="Uploaded Image" />`);
    };

    reader.readAsDataURL(watch('image'));
  };

  return (
    <div className={styles.add_div}>
      <div className={styles["add_div-heading"]}>
        <h3>{isEdit ? "Update" : "Add"} Product</h3>
        <button onClick={() => onCloseButtonClick()}>
          <AiOutlineClose />
        </button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="name">
                Name
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="name"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Product Name"
              />
            )}
          />
          {errors.name && <p className="errormsg">{errors.name.message}</p>}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="brand">
            Brand
          </Form.Label>
          <span style={{ color: "red" }}>*</span>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="brand"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Product Brand"
              />
            )}
          />
          {errors.brand && <p className="errormsg">{errors.brand.message}</p>}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="price">
            Price
          </Form.Label>
          <span style={{ color: "red" }}>*</span>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="price"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Product Price"
              />
            )}
          />
          {errors.price && <p className="errormsg">{errors.price.message}</p>}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="discount">
                Discount
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="discount"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Product Discount"
              />
            )}
          />
          {errors.discount && (
            <p className="errormsg">{errors.discount.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="description">
            Description
          </Form.Label>
          <span style={{ color: "red" }}>*</span>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="description"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Product Description"
              />
            )}
          />
          {errors.description && (
            <p className="errormsg">{errors.description.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className={styles.gstdiv}>
            <div className={styles.blcopy}>
              Product Logo
              <span style={{ color: "red" }}>*</span>
            </div>

            <div className={styles.gstfileupload}>
              {watch("image") ? (
                <div className={styles.deleteIcon}>
                  <div style={{color:"blue", cursor:"pointer"}} onClick={handleClick}>{watch("image")?.name}</div>
                  <DeleteIcon onClick={() => removeUploadedFile()} />
                </div>
              ) : (
                <>
                  <button type="button" className={styles.button} onClick={() => inputRef.current.click()}>Upload Image</button>
                  <input
                    hidden
                    ref={inputRef}
                    id="image"
                    className={styles.blfileupload}
                    type="file"
                    onChange={(event) => uploadHandler(event)}
                  />
                </>
              )}
            </div>
          </div>
          <p className="errormsg">{errors?.companyFilePath?.message}</p>
        </Form.Group>
        <div className="pt-4">
          <ToggleButtonGroup
            sx={{ margin: "0 0 20px 0", width: "100%" }}
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
            className="togglebtn"
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButton
                  {...field}
                  sx={{ width: "50%" }}
                  selected={field.value === 1}
                  className="togglechildbtn"
                  value={1}
                  aria-label="left aligned"
                >
                  Active
                </ToggleButton>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButton
                  sx={{ width: "50%" }}
                  {...field}
                  selected={field.value === 2}
                  className={styles.togglechildbtn}
                  onChange={(e) => field.onChange(e)}
                  value={2}
                  aria-label="centered"
                >
                  Deactive
                </ToggleButton>
              )}
            />
          </ToggleButtonGroup>
        </div>
        <div className="pt-3 pb-3">
          <button className={styles.savebtn}>
            {(addProductPending && updateProductPending ) ? <CircularProgress size={20} /> : (isEdit ? "Update Product" :  "Save Product")}
          </button>
        </div>
      </Form>
    </div>
  );
}

export default AddProductDrawer;
