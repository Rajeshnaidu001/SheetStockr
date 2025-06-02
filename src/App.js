import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceTable from "./InvoiceTable";
import AddInvoiceForm from "./AddInvoiceForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceTable />} />
        <Route path="/add" element={<AddInvoiceForm />} />
      </Routes>
    </Router>
  );
}

export default App; 