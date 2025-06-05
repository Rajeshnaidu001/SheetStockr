import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceTable from "./InvoiceTable";
import AddInvoiceForm from "./AddInvoiceForm";
import OutwardTable from "./OutWardTable"; // import your outward table
import HomePage from "./HomePage"; // import the new homepage

function App() {
  return (
    <Router basename="/SheetStockr">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/invoices" element={<InvoiceTable />} />
        <Route path="/add" element={<AddInvoiceForm />} />
        <Route path="/outward" element={<OutwardTable />} />
      </Routes>
    </Router>
  );
}

export default App;