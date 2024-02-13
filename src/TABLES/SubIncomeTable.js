import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


class SubIncomeTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subIncomeData: [],
      showForm: false,
      newWorkDate: null,
      newWorkAmount: '',
    };
  }

  // Function to handle opening the Add Work form
  handleOpenForm = () => {
    this.setState({
      showForm: true,
    });
  };

  // Function to handle closing the Add Work form
  handleCloseForm = () => {
    this.setState({
      showForm: false,
      newWorkDate: null,
      newWorkAmount: '',
    });
  };

  // Function to handle adding new work data to the selected category
  handleAddWork = async () => {
    const { selectedCategory, type } = this.props;
    const { newWorkDate, newWorkAmount } = this.state;

    try {
      // Format the date to "dd/mm/yyyy"
      const formattedDate = newWorkDate.split('-').reverse().join('/');

      // Add a new document to the category collection
      await firebaseApp.firestore().collection('CATEGORY').doc(type).collection(type).doc(selectedCategory).collection(selectedCategory).add({
        Date: formattedDate,
        Amount: newWorkAmount,
      });

      this.updateSubIncomeData(selectedCategory);
      this.handleCloseForm();
    } catch (error) {
      console.error('Error adding work data:', error);
    }
  };

  // Function to handle deleting a work entry
  handleDeleteWork = async (workId) => {
    const { selectedCategory, type } = this.props;

    try {
      // Delete the document from the collection
      await firebaseApp.firestore().collection('CATEGORY').doc(type).collection(type).doc(selectedCategory).collection(selectedCategory).doc(workId).delete();

      // Refresh the subIncomeData after deletion
      this.updateSubIncomeData(selectedCategory);
    } catch (error) {
      console.error('Error deleting work data:', error);
    }
  };


  // Function to fetch subIncomeData from Firebase
  getSubIncomeData = async (selectedCategory) => {
    const { type } = this.props;

    try {
      const snapshot = await firebaseApp
        .firestore()
        .collection('CATEGORY')
        .doc(type)
        .collection(type)
        .doc(selectedCategory)
        .collection(selectedCategory)
        .orderBy('Date', 'desc')  // Order by Date in descending order
        .get();

      const subIncomeData = snapshot.docs.map((doc) => ({
        date: doc.get('Date'),
        amount: doc.get('Amount'),
        id: doc.id,
      }));

      // Update the state with the subIncomeData
      this.setState({
        subIncomeData,
      });
    } catch (error) {
      console.error('Error getting subIncomeData:', error);
    }
  };



  // Function to update subIncomeData with the selected category
  updateSubIncomeData = (selectedCategory) => {
    this.getSubIncomeData(selectedCategory);
  };

  // Fetch subIncomeData when the component mounts
  componentDidMount() {
    this.getSubIncomeData(this.props.selectedCategory);
  }

  // Fetch subIncomeData when the selected category changes
  componentDidUpdate(prevProps) {
    if (this.props.selectedCategory !== prevProps.selectedCategory) {
      this.getSubIncomeData(this.props.selectedCategory);
    }
  }
  getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[parseInt(month) - 1] || '';
  };

  groupByMonth = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const month = item.date.split('/')[1];
      if (!groupedData[month]) {
        groupedData[month] = [];
      }
      groupedData[month].push(item);
    });
  
    // Sort data within each month in descending order
    Object.values(groupedData).forEach((monthData) => {
      monthData.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  
    // Sort months in ascending order
    const sortedGroupedData = Object.entries(groupedData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return sortedGroupedData;
  };
  


  render() {
    const { subIncomeData } = this.state;

    // Group data by month
    const groupedData = this.groupByMonth(subIncomeData);

    return (
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '1%' }}>{this.props.selectedCategory}</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([month, dataItems]) => (
              <React.Fragment key={month}>
                <tr style={{ backgroundColor: '#add8e6' }}>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    {`${this.getMonthName(month)} - ₹ ${dataItems.reduce((total, item) => total + parseInt(item.amount), 0)}`}
                  </td>
                </tr>
                {dataItems.map((val) => (
                  <tr key={val.id}>
                    <td>{val.date}</td>
                    <td>{`₹ ${val.amount}`}</td>
                    <td>
                      <DeleteIcon
                        className='deleteIcon'
                        onClick={() => this.handleDeleteWork(val.id)}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Add Work button to open the form */}
        <Button
          style={{ marginTop: '2%', right: '0' }}
          variant="contained"
          onClick={this.handleOpenForm}
        >
          Add Work
        </Button>


        {/* Add Work form */}
        {this.state.showForm && (
          <div style={{ marginTop: '2%' }}>
           

            {/* Date input by choosing from the calendar */}
            <TextField
              label="Date"
              variant="outlined"
              type="date"
              value={this.state.newWorkDate}
              onChange={(e) => this.setState({ newWorkDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Amount"
              variant="outlined"
              value={this.state.newWorkAmount}
              onChange={(e) => this.setState({ newWorkAmount: e.target.value })}
              style={{ marginLeft: '10px' }}
            />
            <Button
              variant="contained"
              style={{ marginLeft: '10px' }}
              onClick={this.handleAddWork}
            >
              Submit
            </Button>

            {/* Close form button */}
            <Button
              variant="contained"
              style={{ marginLeft: '10px' }}
              onClick={this.handleCloseForm}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default SubIncomeTable;
