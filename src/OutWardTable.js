import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function OutwardTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
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
    const outwardNumberToDelete = data[index]["Outward Number"];
    const confirmed = window.confirm(`Are you sure you want to delete outward entry "${outwardNumberToDelete}"?`);
    if (!confirmed) return;
    try {
      await fetch(sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", outwardNumber: outwardNumberToDelete }),
      });
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      alert("Outward entry deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete outward entry.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : value;
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredData = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (sortField.toLowerCase().includes("date")) {
      return sortOrder === "asc" ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
    }
    return sortOrder === "asc"
      ? aVal.toString().localeCompare(bVal.toString())
      : bVal.toString().localeCompare(aVal.toString());
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Outward Table
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/add-outward")}>Add Outward</Button>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />

          <FormControl variant="outlined" size="small" style={{ minWidth: 140 }}>
            <InputLabel id="sort-field-label">Sort By</InputLabel>
            <Select labelId="sort-field-label" label="Sort By" value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <MenuItem value="None"><em>None</em></MenuItem>
              <MenuItem value="Outward Date">Outward Date</MenuItem>
              <MenuItem value="Outward Number">Outward Number</MenuItem>
              <MenuItem value="Receiver">Receiver</MenuItem>
              <MenuItem value="Vehicle Number">Vehicle Number</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup value={sortOrder} exclusive onChange={(e, val) => val && setSortOrder(val)}>
            <ToggleButton value="asc"><FontAwesomeIcon icon={faArrowDown} /></ToggleButton>
            <ToggleButton value="desc"><FontAwesomeIcon icon={faArrowUp} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Outward Number</strong></TableCell>
              <TableCell><strong>Outward Date</strong></TableCell>
              <TableCell><strong>Receiver</strong></TableCell>
              <TableCell><strong>Vehicle Number</strong></TableCell>
              <TableCell><strong>Control</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No Data</TableCell></TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row["Outward Number"]}</TableCell>
                  <TableCell>{formatDate(row["Outward Date"])}</TableCell>
                  <TableCell>{row["Receiver"]}</TableCell>
                  <TableCell>{row["Vehicle Number"]}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => navigate("/add-outward", { state: { editMode: true, formData: row } })}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(data.indexOf(row))}><Delete /></IconButton>
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
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Box>
  );
}