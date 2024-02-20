import { useState } from "react";
import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import AddUserDrawer from "./addUserDrawer";
import Loader from "../../../../components/loader";
import { convertFirstLettersAsUpperCase } from "../../../../helper";
import { useGetAllUsers, useUpdateUserStatus } from "../../../../hooks/user";
import { MdSearch } from "react-icons/md";
import { Drawer, Switch } from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../../redux/slices/sidebarSlice";
import MenuIcon from "@mui/icons-material/Menu";
import {
	IconButton
} from "@mui/material";

export default function AdminDashboard() {
  const [popup, setPopup] = useState(null);
  const [alignment, setAlignment] = useState("left");
  const [searchTerm, setSearchTerm] = useState("");
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch()

  const { data, isLoading, isError, error } = useGetAllUsers();
  const { mutateAsync, isLoading: updateLoading } = useUpdateUserStatus();
  const { enqueueSnackbar } = useSnackbar();

  function filterArrayUsingSearchTermAndFilters(array, searchTerm) {
    return array.filter((e) => {
      const searchTermCondition = e.email
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
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      valueFormatter: ({ value }) =>
        convertFirstLettersAsUpperCase(value ?? "Not Updated"),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      valueFormatter: ({ value }) =>
        convertFirstLettersAsUpperCase(value ?? "Not Updated"),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      valueFormatter: ({ value }) =>
        convertFirstLettersAsUpperCase(value ?? "Not Updated"),
    },
    {
      flex: 1,
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: ({ value, row: { _id } }) => (
        <Switch
          checked={value === 1}
          disabled={updateLoading}
          onChange={() => handleUpdateStatus(value, _id)}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error.message}</div>;
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
					<h3 className={styles.title}>Users</h3>
				</div>
        <div className={styles.buttondiv}>
						<button
							className={styles.button}
							onClick={() => setPopup("add")}>
							 Add User
						</button>
					</div>
        {/* <button className={styles.button} onClick={() => setPopup("add")}>
         
        </button> */}
        {/* <div className={styles.titlediv}>
          <h3 className={styles.title}>Users</h3>
          {/* <button
            className={styles.buttonLogout}
            onClick={() => {
              localStorage.clear();
              window.location.replace("/login");
            }}
          >
            Logout
          </button> */}
        {/* </div> */} 
      </div>
      <Drawer
        anchor={"right"}
        open={popup !== null}
        sx={{ width: { sm: "400px" } }}
      >
        <AddUserDrawer
          alignment={alignment}
          handleAlignment={handleAlignment}
          onCloseButtonClick={() => setPopup(null)}
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
          rows={filterArrayUsingSearchTermAndFilters(data, searchTerm)}
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
          loading={isLoading || updateLoading}
          hideFooterSelectedRowCount={true}
        />
      </div>
    </div>
  );
}
