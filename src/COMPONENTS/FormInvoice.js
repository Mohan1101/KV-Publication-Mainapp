import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import firebaseApp from '../Firebasse';

function FormInvoice({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    reason: '',
    amount: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Include the Date field when submitting the form
    const currentDate = new Date().toLocaleDateString();
    onSubmit({ ...formData, Date: currentDate });
    onClose();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div>
      <div className="form-invoice">
        <h1>Invoice</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <TextField
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              fullWidth
              id="reason"
              label="Reason"
              variant="outlined"
              name="reason"
              value={formData.reason}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <TextField
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              fullWidth
              id="amount"
              label="Amount"
              variant="outlined"
              name="amount"
              value={formData.amount}
            />
          </div>
          <div>
            <Button type="submit" variant="contained">
              SUBMIT DATA
            </Button>
            <Button onClick={onClose} variant="outlined">
              CANCEL
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormInvoice;
