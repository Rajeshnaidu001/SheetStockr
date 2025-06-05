import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Typography,
  Box,
  TablePagination,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";

export default function InvoiceTable() {

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(""); // sort by this field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const sheetUrl =
    "https://script.google.com/macros/s/AKfycbwc_IPBuyRQgR9CPB9CVte-_wXnVIJ9LqcC0sPkBXSP-uoR-7l7dPbxUGMSjSjBWALu/exec";

  useEffect(() => {
    fetch(sheetUrl)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDelete = async (index) => {
    const invoiceNumberToDelete = data[index]["Invoice Number"];
    const confirmed = window.confirm(
      `Are you sure you want to delete invoice "${invoiceNumberToDelete}"?`
    );
    if (!confirmed) return;
    try {
      await fetch(sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          invoiceNumber: invoiceNumberToDelete,
        }),
      });
      // Remove from local state after successful deletion
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      alert("Invoice deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete invoice.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
  
    // Try parsing if it's already in ISO or Date-parsable format
    let date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  
    // Try parsing if value is in DD/MM/YYYY or MM/DD/YYYY format
    const parts = value.split("/");
    if (parts.length === 3) {
      const [part1, part2, part3] = parts.map((p) => parseInt(p, 10));
      
      // Try both DD/MM/YYYY and MM/DD/YYYY
      const d1 = new Date(part3, part2 - 1, part1); // DD/MM/YYYY
      const d2 = new Date(part3, part1 - 1, part2); // MM/DD/YYYY
      
      // Pick the one that results in valid date (e.g. doesn't flip day/month)
      if (!isNaN(d1.getTime()) && d1.getDate() === part1) return d1.toISOString().split("T")[0];
      if (!isNaN(d2.getTime()) && d2.getDate() === part2) return d2.toISOString().split("T")[0];
    }
  
    // Fallback to raw value if parsing failed
    return value;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtering data based on the search term
  const filteredData = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Sorting the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0; // No sort if empty field

    // Get field values; default to empty string if missing.
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";

    // If sorting dates, convert to Date objects.
    if (sortField === "Invoice Date" || sortField === "Delivery Date") {
          const dateA = new Date(aVal);
          const dateB = new Date(bVal);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else {
      // Use localeCompare for strings. Ensure numbers are converted to strings.
      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    }
  });

  // Pagination: slice the sorted data to show current page
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e, newOrder) => {
    if (newOrder !== null) {
      setSortOrder(newOrder);
    }
  };
  console.log("Row keys:", Object.keys(data[0] || {}));
  return (

    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Table
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add")}
        >
          Add Invoice
        </Button>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Search Box */}
          <TextField
            variant="outlined"
            size="small"
            autoComplete="off"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />


          {/* Sort dropdown */}
            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 140, marginLeft: 6 }} // adjust spacing as needed
            >
              <InputLabel id="sort-field-label">Sort By</InputLabel>
              <Select

                labelId="sort-field-label"
                label="Sort By"
                value={sortField}
                onChange={handleSortFieldChange}
                style={{ padding: '0.1px' }} // optional: improves dropdown visibility
              >
                <MenuItem value="None">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Invoice Date">Invoice Date</MenuItem>
                <MenuItem value="Deliver Date">Delivery Date</MenuItem>
                <MenuItem value="Transporter">Transporter</MenuItem>
                <MenuItem value="Docket Number">Docket Number</MenuItem>
                <MenuItem value="Invoice Number">Invoice Number</MenuItem>
              </Select>
            </FormControl>
          

          {/* Sort Order Toggle */}
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={handleSortOrderChange}
            size="Medium"
          >
            <ToggleButton value="asc">
                <FontAwesomeIcon icon={faArrowDown} />
                </ToggleButton>
                <ToggleButton value="desc">
                  <FontAwesomeIcon icon={faArrowUp} />
                </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Invoice Number</strong>
              </TableCell>
              <TableCell>
                <strong>Invoice Date</strong>
              </TableCell>
              <TableCell>
                <strong>Delivery Date</strong>
              </TableCell>
              <TableCell>
                <strong>Transporter</strong>
              </TableCell>
              <TableCell>
                <strong>Docket Number</strong>
              </TableCell>
              <TableCell>
                <strong>Control</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Data 
                </TableCell>
              </TableRow>
            ) :  (

              paginatedData.map((row, index) => (
                
                <TableRow key={index}>
                  <TableCell>{row["Invoice Number"]}</TableCell>
                  <TableCell>{formatDate(row["Invoice Date"])}</TableCell>
                  <TableCell>{formatDate(row["Deliver Date"])}</TableCell>
                  <TableCell>{row["Transporter"]}</TableCell>
                  <TableCell>{row["Docket Number"]}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() =>{
                        
                        alert("Invoice Number Should Match!!!");
                        navigate("/add", {
                          state: { editMode: true, formData: row },
                        })
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(data.indexOf(row))}
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
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Box>
  );
}





