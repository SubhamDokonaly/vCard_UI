import { useState } from "react";
import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import AddProductDrawer from "./productDrawer";
import Loader from "../../../../components/loader";
import { convertFirstLettersAsUpperCase } from "../../../../helper";
import { MdSearch } from "react-icons/md";
import { Drawer, Switch } from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../../redux/slices/sidebarSlice";
import MenuIcon from "@mui/icons-material/Menu";
import {
	IconButton
} from "@mui/material";
import { useGetAllProducts } from "../../../../hooks/admin";
import EditIcon from '@mui/icons-material/Edit';

export default function Products() {
  const [popup, setPopup] = useState(null);
  const [alignment, setAlignment] = useState("left");
  const [searchTerm, setSearchTerm] = useState("");
  const sidebar = useSelector((state) => state.sidebar);
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
  const {data: products, isLoading} = useGetAllProducts()
  const [selectProductData, setSelectProductData] = useState(null)

  function filterArrayUsingSearchTermAndFilters(array, searchTerm) {
    return array.filter((e) => {
      const searchTermCondition = e.name
        .toLowerCase()
        .replace(/\s/g, "")
        .includes(searchTerm.toLowerCase().replace(/\s/g, ""));
      return searchTermCondition;
    });
  }

  const handleAlignment = (_event, newAlignment) => {
    setAlignment(newAlignment);
  };

  async function handleUpdateStatus(statusValue, id) {
    try {
      if (statusValue === 1) {
        await mutateAsync({ status: 2, id });
      } else {
        await mutateAsync({ status: 1, id });
      }
      enqueueSnackbar("User updated Successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueFormatter: ({ value }) =>
        convertFirstLettersAsUpperCase(value ?? "Not Updated"),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      valueFormatter: ({ value }) =>
        convertFirstLettersAsUpperCase(value ?? "Not Updated"),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      flex: 1,
      field: "discount",
      headerName: "Discount",
      width: 140
    },
    {
			field: "Options",
			headerName: "Options",
			width: 100,
			renderCell: ({ row }) => (
				<EditIcon onClick={() => {setSelectProductData(row); setPopup("add"); setIsEdit(true)}} />
			),
		},
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.countrydiv}>
      <div className={styles.headingdiv}>
      <div className={styles.titlediv}>
					{!sidebar.sidebarStatus && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(openSidebar())}
							className={styles.icon}>
							<MenuIcon />
						</IconButton>
					)}
					<h3 className={styles.title}>Products</h3>
				</div>
        <div className={styles.buttondiv}>
						<button
							className={styles.button}
							onClick={() => {setIsEdit(false); setPopup("add")}}>
							 Add Product
						</button>
					</div>
      </div>
      <Drawer
        anchor={"right"}
        open={popup !== null}
        sx={{ width: { sm: "400px" } }}
      >
        <AddProductDrawer
          isEdit={isEdit}
          alignment={alignment}
          handleAlignment={handleAlignment}
          onCloseButtonClick={() => setPopup(null)}
          data={selectProductData}
        />
      </Drawer>
      <div className={styles.searchdiv}>
        <div className={styles.searchbox}>
          <MdSearch />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search user by email"
          />
        </div>
       
      </div>
      <div
        style={{
          height: 430,
          width: "100%",
          marginTop: "10px",
          borderRadius: "5px",
          background: "rgba(30, 106, 255, 0.1)",
        }}
      >
        <DataGrid
          rows={filterArrayUsingSearchTermAndFilters(products, searchTerm)}
          columns={columns.map((column) => ({
            ...column,
            sortable: false,
          }))}
          getRowId={(data) => data._id}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          loading={isLoading}
          hideFooterSelectedRowCount={true}
        />
      </div>
    </div>
  );
}
