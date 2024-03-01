import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

class LedgerTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ledgerData: [],
      selectedLedger: null,
      date: '',
      openDialog: false,
      ledgerName: '',
      transactionType: '',
      startDate:'',
      endDate:'',
    };
  }

  componentDidMount() {
    this.fetchLedgerData();
  }

  fetchLedgerData = async () => {
    try {
      const ledgerDocRef = firebaseApp.firestore().collection('Ledger');
      const ledgerDoc = await ledgerDocRef.get();

      if (!ledgerDoc.empty) {
        const ledgerData = ledgerDoc.docs.map((doc) => ({
          id: doc.id,
          name: doc.get('name'),
          type: doc.get('type'),
          date: doc.get('date'),
        }));

        this.setState({ ledgerData });
        console.log('ledgerData:', ledgerData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  handleAddLedger = async () => {
    const { ledgerName, transactionType , date} = this.state;

     // Check if any of the required fields is empty
  if (!ledgerName || !transactionType || !date) {
    alert("Please fill in all required fields.");
    return;
  }

    try {
      const ledgerDocRef = firebaseApp.firestore().collection('Ledger').doc(ledgerName);
      const ledgerDoc = await ledgerDocRef.get();

      if (!ledgerDoc.exists) {
        await ledgerDocRef.set({
          name: ledgerName,
          type: transactionType,
          date: date,
        });
      }
      // create an empty subcollection for the ledger
      await ledgerDocRef.collection('data').doc().set({})

      this.setState((prevState) => ({
        openDialog: false,
        ledgerData: [...prevState.ledgerData, { id: ledgerName, name: ledgerName, type: transactionType }],
      }));

      this.fetchLedgerData();
      // Reset the form fields
      this.setState({ ledgerName: '', transactionType: '', date: '' });
    } catch (error) {
      console.error('Error adding ledger:', error);
    }
  };

  handleLedgerClick = async (selectedId) => {
    try {
      const selectedLedgerRef = firebaseApp.firestore().collection('Ledger').doc(selectedId);
      const selectedLedgerData = await selectedLedgerRef.collection('data').get();

      if (!selectedLedgerData.empty) {
        const subcollectionData = selectedLedgerData.docs.map((doc) => ({

          type: doc.get('type'),
          credit: doc.get('credit'),
          debit: doc.get('debit'),
          date: doc.get('date'),
          description: doc.get('description'),

        }));

        this.setState({
          selectedLedger: {
            id: selectedId,
            data: subcollectionData,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching subcollection data:', error);
    }
  };

  handleLedgerNameChange = async (id, event) => {
    const { ledgerData } = this.state;
    const updatedData = [...ledgerData];
    const index = updatedData.findIndex((item) => item.id === id);
    updatedData[index].name = event.target.value;
    this.setState({ ledgerData: updatedData });

    try {
      await firebaseApp.firestore().collection('Ledger').doc(id).update({
        name: event.target.value,
      });
      // also update the mane field in the subcollection 'data'
   
    } catch (error) {
      console.error('Error updating ledger name:', error);
    }
  };

  handleTransactionTypeChange = async (id, newTransactionType) => {
    const { ledgerData } = this.state;
    const updatedData = [...ledgerData];
    const index = updatedData.findIndex((item) => item.id === id);
    updatedData[index].type = newTransactionType;
    this.setState({ ledgerData: updatedData });

    try {
      await firebaseApp.firestore().collection('Ledger').doc(id).update({
        type: newTransactionType,
      });
    } catch (error) {
      console.error('Error updating transaction type:', error);
    }
  };

  handleDelete = async (id) => {
    const { ledgerData } = this.state;
    const updatedData = ledgerData.filter((item) => item.id !== id);
    this.setState({ ledgerData: updatedData, selectedLedger: null });

    try {
      // Delete the subcollection data
      const subcollectionRef = firebaseApp.firestore().collection('Ledger').doc(id).collection('data');
      const subcollectionData = await subcollectionRef.get();

      if (!subcollectionData.empty) {
        const deletePromises = subcollectionData.docs.map((doc) => doc.ref.delete());
        await Promise.all(deletePromises);
      }

      // Delete the ledger document
      await firebaseApp.firestore().collection('Ledger').doc(id).delete();
    } catch (error) {
      console.error('Error deleting ledger:', error);
    }
  };
  

  
  

  filterEntriesByDate = (startDate, endDate) => {
    return this.state.daybookData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  handleDateFilter = async () => {
    const { date, startDate, endDate } = this.state;
  
    try {
      const ledgerDocRef = firebaseApp.firestore().collection('Ledger');
      const ledgerDocs = await ledgerDocRef.get();
  
      let ledgerData = [];
  
      const promises = ledgerDocs.docs.map(async (ledgerDoc) => {
        const ledgerDataRef = ledgerDoc.ref;
        const ledgerDataSnapshot = await ledgerDataRef.get();
  
        if (ledgerDataSnapshot.exists) {
          const ledgerItem = {
            id: ledgerDoc.id,
            ...ledgerDataSnapshot.data(),
          };
  
          // Check if the ledger's date is within the specified range
          if (startDate && endDate) {
            const ledgerDate = new Date(ledgerItem.date);
            if (ledgerDate >= new Date(startDate) && ledgerDate <= new Date(endDate)) {
              ledgerData.push(ledgerItem);
            }
          } else {
            ledgerData.push(ledgerItem);
          }
        }
      });
  
      await Promise.all(promises);
  
      this.setState({ ledgerData });
    } catch (error) {
      console.error('Error fetching ledger data:', error);
    }
  };
  

  convertToDDMMYYYY = (inputDate) => {
    // Check if the input is a valid date and handle it
    if (!inputDate) return '';

    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  };

   // Calculate total credit, total debit, and balance for selected ledger
   calculateTotalsAndBalance = () => {
    const { selectedLedger } = this.state;

    if (!selectedLedger) {
      return {
        totalCredit: 0,
        totalDebit: 0,
        balance: 0,
      };
    }

    const totals = selectedLedger.data.reduce((acc, item) => {
      acc.totalCredit += item.credit || 0;
      acc.totalDebit += item.debit || 0;
      return acc;
    }, {
      totalCredit: 0,
      totalDebit: 0,
      
    });

    const balance = totals.totalCredit - totals.totalDebit;

    return {
      totalCredit: totals.totalCredit,
      totalDebit: totals.totalDebit,
      balance: balance,
    };
  };

  render() {
    const { ledgerData, selectedLedger, date, openDialog, ledgerName, transactionType } = this.state;
    const { totalCredit, totalDebit, balance } = this.calculateTotalsAndBalance();

    return (
      <div>
        <div className='flex '>
       
       <div className='w-full flex items-center gap-12 -mt-6 pb-2'>
          <div>
            <h2 className='text-lg -mb-1 font-bold'>Start Date</h2>
            <TextField 

              type="date"
              value={this.state.startDate}
              onChange={(e) => this.setState({ startDate: e.target.value })}
            />
          </div>

          <div>
            <h2 className='text-lg -mb-1  font-bold'>End Date</h2>
            <TextField
              type="date"
              value={this.state.endDate}
              onChange={(e) => this.setState({ endDate: e.target.value })}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.handleDateFilter(this.state.startDate, this.state.endDate)}
          >
            Apply Filter
          </Button>

        

         
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: 'right', marginBottom:'2%', marginTop:'0%', width: '140px'}}
          onClick={() => this.setState({ openDialog: true })}
        >
          Add Ledger
        </Button>
    
    </div>
        {/* Ledger Table */}
        { ledgerData.length === 0 && <h2>No Ledger Data Found</h2>}
        <table className='styled-table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date of Creation</th>
              <th>Ledger Name</th>
              <th>Type</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((item, index) => (
              <tr key={item.id} onClick={() => this.handleLedgerClick(item.id)} style={{ cursor: 'pointer' }}>
                <td>{index + 1}</td>
              
                <td>{this.convertToDDMMYYYY(item.date)}</td>
                <td>
                  <TextField
                    value={item.name}
                    onChange={(e) => this.handleLedgerNameChange(item.id, e)}
                  />
                </td>
                <td>
                  <FormControl>
                    <InputLabel id={`transaction-type-label-${item.id}`}>Transaction Type</InputLabel>
                    <Select
                      labelId={`transaction-type-label-${item.id}`}
                      value={item.type}
                      onChange={(e) => this.handleTransactionTypeChange(item.id, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="Credit">Credit</MenuItem>
                      <MenuItem value="Debit">Debit</MenuItem>
                    </Select>
                  </FormControl>
                </td>
                <td>
                  <DeleteIcon
                    className='deleteIcon'
                    onClick={() => this.handleDelete(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Ledger Dialog */}
        <Dialog open={openDialog} onClose={() => this.setState({ openDialog: false })}>

          <DialogTitle>Add Ledger</DialogTitle>
          <DialogContent className='flex flex-col gap-4 w-[600px]'>

            <TextField
              label="Ledger Name"
              fullWidth
              value={ledgerName}
              onChange={(e) => this.setState({ ledgerName: e.target.value })}
            />
            <TextField
             
              type="date"
              fullWidth
              value={date}
              onChange={(e) => this.setState({ date: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
              <Select
                labelId="transaction-type-label"
                value={transactionType}

                onChange={(e) => this.setState({ transactionType: e.target.value })}
              >
                <MenuItem value="Credit">Credit</MenuItem>
                <MenuItem value="Debit">Debit</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ openDialog: false })}>Cancel</Button>
            <Button variant="contained"
              color="primary"
              onClick={this.handleAddLedger}>Submit</Button>
          </DialogActions>
        </Dialog>

        {/* Subcollection Data Table */}
        {selectedLedger && (
          <>

            <div className='flex mt-4 -mb-4 justify-between'>
            <h2>Ledger Details - {selectedLedger.id}</h2>
            <div className='flex gap-4'>
                <TextField
                  label="Total Credit"
                  value={totalCredit.toString()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Total Debit"
                  value={totalDebit.toString()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Balance"
                  value={balance.toString()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            <Button variant="contained" color="primary"
           style={{  marginBottom: '2%', float: 'right', marginTop: '1%'}}
           onClick={() => this.setState({ selectedLedger: null })}>
            Close
          </Button>
          </div>
            <table className='styled-table'>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  
                </tr>
              </thead>
              <tbody>
                {selectedLedger.data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{this.convertToDDMMYYYY(item.date)}</td>
                    <td>{item.description}</td>
                    <td>{item.credit}</td>
                    <td>{item.debit}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

export default LedgerTable;
