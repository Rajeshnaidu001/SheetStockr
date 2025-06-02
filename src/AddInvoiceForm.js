import React, { useState } from 'react';

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    deliveryDate: '',
    transporter: '',
    docketNumber: '',
    items: [
      {
        productCode: '',
        quantity: 0,
        imeis: ['']
      }
    ]
  });

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = name === 'quantity' ? parseInt(value, 10) : value;
    setFormData({ ...formData, items });
  };

  const handleImeiChange = (itemIndex, imeiIndex, e) => {
    const items = [...formData.items];
    items[itemIndex].imeis[imeiIndex] = e.target.value;
    setFormData({ ...formData, items });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productCode: '', quantity: 0, imeis: [''] }]
    });
  };

  const removeItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData({ ...formData, items });
  };

  const addImei = (index) => {
    const items = [...formData.items];
    items[index].imeis.push('');
    setFormData({ ...formData, items });
  };

  const removeImei = (itemIndex, imeiIndex) => {
    const items = [...formData.items];
    items[itemIndex].imeis.splice(imeiIndex, 1);
    setFormData({ ...formData, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = formData;
    console.log('Submitted JSON:', JSON.stringify(formData, null, 2));
  
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
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input name="invoiceNumber" placeholder="Invoice Number" value={formData.invoiceNumber} onChange={handleMainChange} className="border p-2 w-full" />
      <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleMainChange} className="border p-2 w-full" />
      <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleMainChange} className="border p-2 w-full" />
      <input name="transporter" placeholder="Transporter" value={formData.transporter} onChange={handleMainChange} className="border p-2 w-full" />
      <input name="docketNumber" placeholder="Docket Number" value={formData.docketNumber} onChange={handleMainChange} className="border p-2 w-full" />

      <h3 className="text-lg font-semibold mt-4">Items</h3>

      {formData.items.map((item, i) => (
        <div key={i} className="border p-3 rounded shadow-sm space-y-2">
          <input name="productCode" placeholder="Product Code" value={item.productCode} onChange={(e) => handleItemChange(i, e)} className="border p-2 w-full" />
          <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(i, e)} className="border p-2 w-full" />

          <h4 className="font-medium">IMEIs</h4>
          {item.imeis.map((imei, j) => (
            <div key={j} className="flex space-x-2">
              <input
                value={imei}
                onChange={(e) => handleImeiChange(i, j, e)}
                className="border p-2 w-full"
                placeholder={`IMEI ${j + 1}`}
              />
              {item.imeis.length > 1 && (
                <button type="button" onClick={() => removeImei(i, j)} className="text-red-500">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addImei(i)} className="text-blue-500">+ Add IMEI</button>

          {formData.items.length > 1 && (
            <button type="button" onClick={() => removeItem(i)} className="text-red-500 mt-2">Remove Item</button>
          )}
        </div>
      ))}

      <button type="button" onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded">
        + Add Item
      </button>

      <br />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

