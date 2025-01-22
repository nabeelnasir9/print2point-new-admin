import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { SideMenu } from "../../components";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import "./index.css";
import { SearchNormal } from "./../../svg";

const columns = [
  { id: "Sr", label: "Sr", minWidth: 30 },
  { id: "TicketNumber", label: "Order Number", minWidth: 120 },
  { id: "UserName", label: "User Name", minWidth: 100 },
  { id: "Email", label: "Email", minWidth: 200 },
  { id: "BankName", label: "Bank Name", minWidth: 150 },
  { id: "BankNumber", label: "Bank Number", minWidth: 150 },
  { id: "FullNameBank", label: "Bank Account Name", minWidth: 150 },
  { id: "Message", label: "Message", minWidth: 250 },
  { id: "Status", label: "Status", minWidth: 150 },
];

const Support = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("admin_access_token");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/admin/tickets/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setOrdersList(data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("admin_access_token");
      await fetch(`${process.env.REACT_APP_API_URL}/admin/tickets/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrdersList((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <SideMenu>
      <div className="page-header">
        <div />
        <p>Support</p>
      </div>
      <Grid container spacing={0}>
        {/* <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
          <div className="support-search">
            <img src={SearchNormal} alt="search-icon" />
            <input placeholder="Search by name" />
          </div>
        </Grid> */}
        <Grid item xs={12} sm={12} md={8} lg={9} xl={9}></Grid>
      </Grid>

      <Paper
        sx={{ width: "100%" }}
        style={{ backgroundColor: "#fff", marginTop: "20px" }}
      >
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#f7801a" }}
          >
            <CircularProgress />
          </div>
        ) : (
          <TableContainer sx={{ maxHeight: "62vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#fff",
                      }}
                    >
                      <p className="order-table-header-title">{column.label}</p>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "#fff" }}>
                {ordersList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell>
                        <p className="order-table-text">{i + 1}</p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">{row.order_number}</p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">{row.full_name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">{row.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">
                          {row.bank?.bank_name ? row.bank.bank_name : "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">
                          {row.bank?.bank_number ? row.bank.bank_number : "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">
                          {row.bank?.full_name_bank
                            ? row.bank.full_name_bank
                            : "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="order-table-text">{row.message}</p>
                      </TableCell>
                      <TableCell>
                        {row.status === "Completed" ? (
                          <p className="order-table-status-delivered">
                            {row.status}
                          </p>
                        ) : (
                          <select
                            onChange={(e) =>
                              handleStatusChange(row._id, e.target.value)
                            }
                            className="order-table-dropdown"
                            style={{
                              backgroundColor: "#FFE3E1",
                              color: "#FF3B30",
                            }}
                            value={row.status}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={ordersList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{
            backgroundColor: "#fff",
            color: "#F7801A",
            fontFamily: "Poppins",
          }}
        />
      </Paper>
    </SideMenu>
  );
};

export default Support;
