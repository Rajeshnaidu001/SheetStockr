import React, { useState } from "react";
import './App.css';
const AddInvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    deliveryDate: "",
    transporter: "",
    docketNumber: "",
    items: []
  });

  const handleInvoiceChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const [items, setitems] = useState([
    { productCode: '', quantity: '' },
  ]);

  const handleItemChange = (index, e) => {
    const updated = [...items];
    updated[index][e.target.name] = e.target.value;
    setitems(updated);
  };

  const addItem = () => {
    setitems([...items, { productCode: '', quantity: '' }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setitems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    invoiceData.items = items;
    const payload = invoiceData;
    console.log('Payload:', payload);
  
    try {
      await fetch('https://script.google.com/macros/s/AKfycbwc_IPBuyRQgR9CPB9CVte-_wXnVIJ9LqcC0sPkBXSP-uoR-7l7dPbxUGMSjSjBWALu/exec', {
        method: 'POST',
        mode:"no-cors",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      alert("Invoice submitted.");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit invoice.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
  <h2>Add Invoice</h2>

  <div>
    <label htmlFor="invoiceNumber">Invoice Number:</label>
    <input
      id="invoiceNumber"
      type="text"
      name="invoiceNumber"
      value={invoiceData.invoiceNumber}
      onChange={handleInvoiceChange}
    />
  </div>

  <div>
    <label htmlFor="invoiceDate">Invoice Date:</label>
    <input
      id="invoiceDate"
      type="date"
      name="invoiceDate"
      value={invoiceData.invoiceDate}
      onChange={handleInvoiceChange}
    />
  </div>

  <div>
    <label htmlFor="deliveryDate">Delivery Date:</label>
    <input
      id="deliveryDate"
      type="date"
      name="deliveryDate"
      value={invoiceData.deliveryDate}
      onChange={handleInvoiceChange}
    />
  </div>

  <div>
    <label htmlFor="transporter">Transporter:</label>
    <input
      id="transporter"
      type="text"
      name="transporter"
      value={invoiceData.transporter}
      onChange={handleInvoiceChange}
    />
  </div>

  <div>
    <label htmlFor="docketNumber">Docket Number:</label>
    <input
      id="docketNumber"
      type="text"
      name="docketNumber"
      value={invoiceData.docketNumber}
      onChange={handleInvoiceChange}
    />
  </div>

  <h3>Items</h3>
        {items.map((item, index) => (
        <div key={index}>
            <label htmlFor={`productCode-${index}`}>Product Code:</label>
            <input
            id={`productCode-${index}`}
            type="text"
            name="productCode"
            placeholder="Product Code"
            value={item.productCode}
            onChange={(e) => handleItemChange(index, e)}
            />

            <p>  </p>
            <label htmlFor={`quantity-${index}`}>Quantity:</label>
            <input
            id={`quantity-${index}`}
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, e)}
            />

            <button type="button" onClick={() => removeItem(index)}>
            Remove Item
            </button>
        </div>
        ))}
      <button type="button" onClick={addItem}>
        Add Item
      </button>
      <br />
      <button type="submit">Submit Invoice</button>
    </form>
  );
};

export default AddInvoiceForm;