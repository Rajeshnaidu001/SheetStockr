// src/InvoiceTable.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Button,
  Typography, Box, TablePagination, TextField,
  IconButton, InputAdornment
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";

export default function InvoiceTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const sheetUrl = "https://script.google.com/macros/s/AKfycbwc_IPBuyRQgR9CPB9CVte-_wXnVIJ9LqcC0sPkBXSP-uoR-7l7dPbxUGMSjSjBWALu/exec";

  useEffect(() => {
    fetch(sheetUrl)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDelete = async (index) => {
    const invoiceNumberToDelete = data[index]["Invoice Number"];
  
    try {
      await fetch(sheetUrl, {
        method: 'POST',
        mode:'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          invoiceNumber: invoiceNumberToDelete,
        }),
      });
      
      // Remove from local state after successful deletion
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
  
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete invoice.');
    }
  };

  const formatDate = (isoString) => {
    return isoString ? isoString.split("T")[0] : "";
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Table
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add")}
        >
          Add Invoice
        </Button>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Invoice Number</strong></TableCell>
              <TableCell><strong>Invoice Date</strong></TableCell>
              <TableCell><strong>Deliver Date</strong></TableCell>
              <TableCell><strong>Transporter</strong></TableCell>
              <TableCell><strong>Docket Number</strong></TableCell>
              <TableCell><strong>Control</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No Data</TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row["Invoice Number"]}</TableCell>
                    <TableCell>{formatDate(row["Invoice Date"])}</TableCell>
                    <TableCell>{formatDate(row["Deliver Date"])}</TableCell>
                    <TableCell>{row["Transporter"]}</TableCell>
                    <TableCell>{row["Docket Number"]}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => navigate("/add")}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(index)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}





// // src/InvoiceTable.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './App.css';

// export default function InvoiceTable() {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();
//   const sheetUrl = "https://script.google.com/macros/s/AKfycbwc_IPBuyRQgR9CPB9CVte-_wXnVIJ9LqcC0sPkBXSP-uoR-7l7dPbxUGMSjSjBWALu/exec";
//   useEffect(() => {
//     fetch(sheetUrl)
//       .then((res) => res.json())
//       .then((data) => setData(data))
//       .catch((err) => console.error("Fetch error:", err));
//   }, []);

//   const handleDelete = (index) => {
//     // You can implement deletion logic here (e.g., via Apps Script)
//     const newData = data.filter((_, i) => i !== index);
//     setData(newData);
//   };
//   const formatDate = (isoString) => {
//     return isoString ? isoString.split("T")[0] : "";
//   };

//   return (
//     <div>
//       <h1>Invoice Table</h1>
//       <button onClick={() => navigate("/add")}>Add Invoice</button>
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>Invoice Number</th>
//             <th>Invoice Date</th>
//             <th>Deliver Date</th>
//             <th>Transporter</th>
//             <th>Docket Number</th>
//             <th>Control</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.length === 0 ? (
//             <tr><td colSpan="5">No Data</td></tr>
//           ) : (
//             data.map((row, index) => (
//               <tr key={index}>
//                 <td>{row["Invoice Number"]}</td>
//                 <td>{formatDate(row["Invoice Date"])}</td>
//                 <td>{formatDate(row["Deliver Date"])}</td>
//                 <td>{row["Transporter"]}</td>
//                 <td>{row["Docket Number"]}</td>
//                 <td>
//                   <button onClick={() => navigate("/add")}>Edit</button>{" "}
//                   <button onClick={() => handleDelete(index)}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }