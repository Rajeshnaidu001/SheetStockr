import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to SheetStockr
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/invoices")}
        >
          Go to Invoice Table
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/outward")}
        >
          Go to Outward Table
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;