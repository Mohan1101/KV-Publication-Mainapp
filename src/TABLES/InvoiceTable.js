// InvoiceTable.jsx
import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import DownloadIcon from '@mui/icons-material/Download';

class InvoiceTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creditData: [],
    };
  }

  getCreditData = async () => {
    try {
      const snapshot = await firebaseApp.firestore().collection('Credit').get();

      const data = snapshot.docs.map((doc) => ({
        date: doc.get('Date'),
        receiver: doc.get('SchoolName'), 
        product: doc.get('Products'),
        amount: doc.get('Amount'),
        invoice: doc.get('Downloadablelink'), 
        id: doc.id,
      }));

      this.setState({
        creditData: data,
      });
    } catch (error) {
      console.error('Error fetching credit data:', error);
    }
  };

  componentDidMount = () => {
    this.getCreditData();
  }

  render() {
    return (
      <div>
       
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Receiver</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {this.state.creditData.map((val, index) => (
              <tr key={val.id}>
                <td>{val.date}</td>
                <td>{val.receiver}</td>
                <td>{val.product[index].name}, </td>
                <td>{val.amount}</td>
                <td>
                  <DownloadIcon
                   style={{ cursor: 'pointer' }} 
                    onClick={(e) => {
                      // Open the invoice in a new tab
                      // change pointer to hand
                      
                      val.invoice ? window.open(val.invoice) : alert('No invoice found'); 
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default InvoiceTable;
