
import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button } from '@mui/material';
import FormCredit from '../COMPONENTS/FormCredit';

class ExpenseTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creditData: [],
      expensesData: [],
      showForm: false,
    };
  }

  getCreditsData = async () => {
    try {
      const creditsSnapshot = await firebaseApp.firestore().collection('Credit').get();

      const creditData = creditsSnapshot.docs.map((doc) => ({
        reason: doc.get('Product'), // Display 'Product' under 'Reason'
        amount: doc.get('Amount'),
        id: doc.id,
        source: 'Credit',
      }));

      this.setState({
        creditData: creditData,
      });
    } catch (error) {
      console.error('Error fetching Credit data:', error);
    }
  };

  getExpensesData = async () => {
    try {
      const expensesSnapshot = await firebaseApp.firestore().collection('Expenses').get();

      const expensesData = expensesSnapshot.docs.map((doc) => ({
        reason: doc.get('Reason'),
        amount: doc.get('Amount'),
        id: doc.id,
        source: 'Expenses',
      }));

      this.setState({
        expensesData: expensesData,
      });
    } catch (error) {
      console.error('Error fetching Expenses data:', error);
    }
  };

  componentDidMount = () => {
    this.getCreditsData();
    this.getExpensesData();
  };

  // Function to handle adding a new credit
  handleAddWork = () => {
    // Set showForm to true to display the FormCredit component
    this.setState({ showForm: true });
  };

  // Function to handle closing the FormCredit component
  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.getCreditsData();
    this.getExpensesData();
  };

  render() {
    const combinedData = [...this.state.creditData, ...this.state.expensesData];

    return (
      <div>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Reason</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((val) => {
              return (
                <tr key={val.id}>
                  <td>{val.reason}</td>
                  <td>{`₹ ${val.amount}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Use the same strategy for the "Add Work" button as in the InvoiceTable */}
        <Button
          style={{ marginTop: '2%', float: 'right' }}
          variant="contained"
          onClick={this.handleAddWork}
        >
          Add Work
        </Button>

        {this.state.showForm && <FormCredit onClose={this.handleCloseForm} />}
      </div>
    );
  }
}

export default ExpenseTable;
