// FormCredit.jsx
import React from 'react';
import { Button, TextField } from '@mui/material';
import firebaseApp from '../Firebasse';

var data = {
  Reason: '',
  Amount: 0,
};

async function postData() {
  const dbs = firebaseApp.firestore().collection('Expenses').doc(); // Change the collection name to 'Credit'
  const add = dbs.set(data);
  add.finally((e) => {
    console.log(e);
    window.location = '/';
  });
}

function FormCredit() {
  return (
    <div>
      <div className="form-invoice">
        <h1>Credit</h1>
        <div style={{ marginBottom: '1rem' }}>
          <TextField
            onChange={(e) => {
              data.Reason = e.target.value;
            }}
            fullWidth
            id="reason"
            label="Reason"
            variant="outlined"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <TextField
            onChange={(e) => {
              // Ensure that Amount is treated as a number
              data.Amount = parseFloat(e.target.value) || 0;
            }}
            fullWidth
            id="amount"
            label="Amount"
            variant="outlined"
          />
        </div>
        <div>
          <Button
            onClick={() => {
              postData();
            }}
            variant="contained"
          >
            SUBMIT DATA
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormCredit;
