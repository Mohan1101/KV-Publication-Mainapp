import React, { Component } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import firebaseApp from '../Firebasse';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import * as XLSX from 'xlsx';

class DaybookTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      daybookData: [],
      ledgerOptions: [],
      selectedLedger: '',
      openDialog: false,
      date: '',
      credit: '',
      debit: '',
      description: '',
      startDate: '',
      endDate: '',
    };
  }

  componentDidMount() {
    this.fetchLedgerOptions();
    this.fetchDaybookData();
  }

  fetchLedgerOptions = async () => {
    try {
      const ledgerDocRef = firebaseApp.firestore().collection('Ledger');
      const ledgerDoc = await ledgerDocRef.get();

      if (!ledgerDoc.empty) {
        const ledgerOptions = ledgerDoc.docs.map((doc) => ({
          id: doc.id,
          name: doc.get('name'),
        }));

        this.setState({ ledgerOptions });
      }
    } catch (error) {
      console.error('Error fetching ledger options:', error);
    }
  };

  convertToDDMMYYYY = (inputDate) => {
    if (!inputDate) return '';
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  };

  fetchDaybookData = async () => {
    try {
      const ledgerDocRef = firebaseApp.firestore().collection('Ledger');
      const ledgerDocs = await ledgerDocRef.get();

      let daybookData = []; // Initialize array here

      const promises = ledgerDocs.docs.map(async (ledgerDoc) => {
        const daybookDataRef = ledgerDoc.ref.collection('data');
        const daybookDataSnapshot = await daybookDataRef.get();

        if (!daybookDataSnapshot.empty) {
          const daybookEntries = daybookDataSnapshot.docs.map((doc) => ({
            id: doc.id,
            ledgerId: ledgerDoc.id,
            ...doc.data(),
          }));

          const hasLedgerName = daybookEntries.some(entry => entry.name === ledgerDoc.get('name'));

          if (hasLedgerName) {
            daybookData = [...daybookData, ...daybookEntries];
          }
        }
      });

      await Promise.all(promises);

      this.setState({ daybookData }); // Update state after processing
    } catch (error) {
      console.error('Error fetching all daybook data:', error);
    }
  };



  handleAddDaybook = async () => {
    const { selectedLedger, date, credit, debit, description } = this.state;

        // Check if any of the required fields is empty
  if (!selectedLedger || !date || !credit || !debit || !description) {
    alert("Please fill in all required fields.");
    return;
  }

    try {
      const daybookDataRef = firebaseApp.firestore().collection('Ledger').doc(selectedLedger).collection('data');
      await daybookDataRef.add({
        name: selectedLedger,
        date,
        credit: parseFloat(credit),
        debit: parseFloat(debit),
        description,
      });

      this.fetchDaybookData();
      this.handleCloseDialog();
      // Reset the form fields
      this.setState({ selectedLedger: '', date: '', credit: '', debit: '', description: '' });
    } catch (error) {
      console.error('Error adding daybook entry:', error);
    }
  };

  handleDeleteDaybook = async (ledgerId, daybookId) => {
    try {
      const daybookDataRef = firebaseApp.firestore().collection('Ledger').doc(ledgerId).collection('data');
      await daybookDataRef.doc(daybookId).delete();

      this.setState((prevState) => ({
        daybookData: prevState.daybookData.filter((entry) => entry.id !== daybookId),
      }));
    } catch (error) {
      console.error('Error deleting daybook entry:', error);
    }
  };

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({
      openDialog: false,
      date: '',
      credit: '',
      debit: '',
      description: '',
    });
  };

  getTotalCredit = () => {
    return this.state.daybookData.reduce((total, entry) => total + entry.credit, 0);
  };

  getTotalDebit = () => {
    return this.state.daybookData.reduce((total, entry) => total + entry.debit, 0);
  };

  filterEntriesByDate = (startDate, endDate) => {
    return this.state.daybookData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  handleDateFilter = async () => {
    const { startDate, endDate } = this.state;

    try {
      const ledgerDocRef = firebaseApp.firestore().collection('Ledger');
      const ledgerDocs = await ledgerDocRef.get();

      let daybookData = []; // Initialize array here

      const promises = ledgerDocs.docs.map(async (ledgerDoc) => {
        const daybookDataRef = ledgerDoc.ref.collection('data');
        const daybookDataSnapshot = await daybookDataRef.get();

        if (!daybookDataSnapshot.empty) {
          const daybookEntries = daybookDataSnapshot.docs.map((doc) => ({
            id: doc.id,
            ledgerId: ledgerDoc.id,
            ...doc.data(),
          }));

          const hasLedgerName = daybookEntries.some(entry => entry.name === ledgerDoc.get('name'));

          if (hasLedgerName) {
            daybookData = [...daybookData, ...daybookEntries];
          }
        }
      });

      await Promise.all(promises);

      if (startDate && endDate) {
        const filteredEntries = daybookData.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        });

        this.setState({ daybookData: filteredEntries });
      } else {
        this.setState({ daybookData }); // Reset to the original daybook data
      }
    } catch (error) {
      console.error('Error fetching daybook data:', error);
    }
  };

  handleEditCredit = async (daybookId, value) => {
    try {
      const updatedData = this.state.daybookData.map((entry) => {
        if (entry.id === daybookId) {
          entry.credit = parseFloat(value);

          // Update the credit in Firestore
          firebaseApp
            .firestore()
            .collection('Ledger')
            .doc(entry.ledgerId)
            .collection('data')
            .doc(daybookId)
            .update({
              credit: parseFloat(value),
            });
        }
        return entry;
      });

      this.setState({ daybookData: updatedData });
    } catch (error) {
      console.error('Error editing credit:', error);
    }
  };

  handleEditDebit = async (daybookId, value) => {
    try {
      const updatedData = this.state.daybookData.map((entry) => {
        if (entry.id === daybookId) {
          entry.debit = parseFloat(value);

          // Update the debit in Firestore
          firebaseApp
            .firestore()
            .collection('Ledger')
            .doc(entry.ledgerId)
            .collection('data')
            .doc(daybookId)
            .update({
              debit: parseFloat(value),
            });
        }
        return entry;
      });

      this.setState({ daybookData: updatedData });
    } catch (error) {
      console.error('Error editing debit:', error);
    }
  };

  handleEditDescription = async (daybookId, value) => {
    try {
      const updatedData = this.state.daybookData.map((entry) => {
        if (entry.id === daybookId) {
          entry.description = value;

          // Update the description in Firestore
          firebaseApp
            .firestore()
            .collection('Ledger')
            .doc(entry.ledgerId)
            .collection('data')
            .doc(daybookId)
            .update({
              description: value,
            });
        }
        return entry;
      });

      this.setState({ daybookData: updatedData });
    } catch (error) {
      console.error('Error editing description:', error);
    }
  };

  exportToExcel = () => {
    const { daybookData } = this.state;
  
    // Map through daybookData and format the date using convertToDDMMYYYY method
    const formattedData = daybookData.map(entry => ({
      ...entry,
      date: this.convertToDDMMYYYY(entry.date), // Format the date
    }));
  
    // Create an array with the header row
    const excelData = [
      ["S.No", "Date", "Ledger Name", "Credit", "Debit", "Description"],
      ...formattedData.map(({ id, ledgerId, ...item }, index) => [
        index + 1,
        item.date,
        item.name,
        item.credit,
        item.debit,
        item.description
      ])
    ];
  
    // Add Total row
    const totalRow = [
      "",
      "",
      "Total",
      this.getTotalCredit(),
      this.getTotalDebit(),
      "",
    ];
  
    excelData.push(totalRow);
  
    // Calculate the balance and add it as a row
    const balanceRow = [
      "",
      "",
      "Balance",
      "",
      this.getTotalCredit() - this.getTotalDebit(),
    ];
  
    excelData.push(balanceRow);
  
    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
  
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DaybookData");
  
    // Write the file
    XLSX.writeFile(wb, "DaybookData.xlsx");
  };
  

  render() {
    const {
      ledgerOptions,
      selectedLedger,
      openDialog,
      date,
      credit,
      debit,
      description,
      daybookData,
    } = this.state;

    const totalCredit = this.getTotalCredit();
    const totalDebit = this.getTotalDebit();

    return (
      <div>



        <div className='w-full flex items-center justify-evenly gap-8 -mt-4 pb-4 '>
          <div>
            <span className='mr-2 text-lg font-bold'>Start Date</span>
            <TextField
               size = 'small'
              type="date"
              value={this.state.startDate}
              onChange={(e) => this.setState({ startDate: e.target.value })}
            />
          </div>

          <div>
            <span className='mr-2 text-lg font-bold'>End Date</span>
            <TextField
             size = 'small'
              type="date"
              value={this.state.endDate}
              onChange={(e) => this.setState({ endDate: e.target.value })}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '0%' , width:'190px'}}
            onClick={() => this.handleDateFilter(this.state.startDate, this.state.endDate)}
          >
            Apply Filter
          </Button>

          
          <Button
            variant="contained"
            color="primary"
         
            onClick={this.exportToExcel}
          >
            Export to Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ float: 'right', marginBottom: '0%', width:'210px'}}
            onClick={this.handleOpenDialog}
          >
            Add Daybook
          </Button>
          
        </div>



        {/* Daybook Table */}
        {daybookData.length === 0 && <h2>No Data Found</h2>}
<table className="styled-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Date</th>
      <th>Ledger Name</th>
      <th>Credit</th>
      <th>Debit</th>
      <th>Description</th>
      <th>Operation</th>
    </tr>
  </thead>
  <tbody>
    {daybookData.map((entry, index) => (
      <tr key={entry.id}>
        <td>{index + 1}</td>
        <td>{this.convertToDDMMYYYY(entry.date)}</td>
        <td>{entry.name}</td>
        <td>
          <TextField
            type="number"
            value={entry.credit}
            size="small"
            onChange={(e) => this.handleEditCredit(entry.id, e.target.value)}
          />
        </td>
        <td>
          <TextField
            type="number"
            size="small"
            value={entry.debit}
            onChange={(e) => this.handleEditDebit(entry.id, e.target.value)}
          />
        </td>
        <td>
          <TextField
            type="text"
            size="small"
            value={entry.description}
            onChange={(e) => this.handleEditDescription(entry.id, e.target.value)}
          />
        </td>
        <td>
          <DeleteIcon
            className="deleteIcon"
            onClick={() => this.handleDeleteDaybook(entry.ledgerId, entry.id)}
          />
        </td>
      </tr>
    ))}
    <tr>
      <td colSpan="3"></td>
      <td>
        <TextField size="small" label="Total Credit" value={totalCredit.toString()} readOnly />
      </td>
      <td>
        <TextField size="small" label="Total Debit" value={totalDebit.toString()} readOnly />
      </td>
      <td>
        <TextField size="small" label="Balance" value={(totalCredit - totalDebit).toString()} readOnly />
      </td>
      <td colSpan="1"></td>
    </tr>
   
  </tbody>
</table>





        {/* Add Daybook Dialog */}
        <Dialog open={openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Add Daybook</DialogTitle>
          <DialogContent className='flex flex-col gap-4 w-[600px]'>
            <FormControl fullWidth>
              <InputLabel className='mt-1' id="ledger-label">Select Ledger</InputLabel>
              <Select
                labelId="ledger-label"
                value={selectedLedger}
                onChange={(e) => this.setState({ selectedLedger: e.target.value })}
              >
                {ledgerOptions.map((ledger) => (
                  <MenuItem key={ledger.id} value={ledger.id}>
                    {ledger.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField

              type="date"
              size = 'small'
              fullWidth
              value={date}
              onChange={(e) => this.setState({ date: e.target.value })}
            />
            <TextField
              label="Credit"
              type="number"
               size = 'small'

              fullWidth
              value={credit}
              onChange={(e) => this.setState({ credit: e.target.value })}
            />
            <TextField
              label="Debit"
              type="number"
              size = 'small'



              fullWidth
              value={debit}
              onChange={(e) => this.setState({ debit: e.target.value })}
            />
            <TextField
              label="Description"
              size = 'small'
              multiline
              fullWidth
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseDialog}>Cancel</Button>
            <Button variant='contained' color='primary'
              onClick={this.handleAddDaybook}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DaybookTable;
