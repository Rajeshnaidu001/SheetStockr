// src/InvoiceTable.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

export default function InvoiceTable() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const sheetUrl = "https://script.google.com/macros/s/AKfycbwc_IPBuyRQgR9CPB9CVte-_wXnVIJ9LqcC0sPkBXSP-uoR-7l7dPbxUGMSjSjBWALu/exec";
  useEffect(() => {
    fetch(sheetUrl)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDelete = (index) => {
    // You can implement deletion logic here (e.g., via Apps Script)
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };
  const formatDate = (isoString) => {
    return isoString ? isoString.split("T")[0] : "";
  };

  return (
    <div>
      <h1>Invoice Table</h1>
      <button onClick={() => navigate("/add")}>Add Invoice</button>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Invoice Date</th>
            <th>Deliver Date</th>
            <th>Quantity</th>
            <th>Control</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="5">No Data</td></tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                <td>{row["Invoice Number"]}</td>
                <td>{formatDate(row["Invoice Date"])}</td>
                <td>{formatDate(row["Deliver Date"])}</td>
                <td>{row["Quantity"]}</td>
                <td>
                  <button onClick={() => navigate("/add")}>Edit</button>{" "}
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}