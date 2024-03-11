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
        amount: doc.get('creditTotal'),
        balance: doc.get('balance'),
        orderId: doc.get('orderid'),
        invoiceamount: doc.get('invoiceTotal'),
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
        {this.state.creditData.length === 0 && <h2>No Data Found</h2>}
        <table className="styled-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Order Id</th>
              <th>Date</th>
              <th>Receiver</th>
              <th>Product</th>
              <th>Invoice Amount</th>
              <th>Credit Amount</th>
              <th>Balance</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {this.state.creditData.map((val, index) => (
              <tr key={val.id}>
                <td>{index + 1}</td>
                <td>{val.orderId}</td>
                <td>{val.date}</td>
                <td>{val.receiver}</td>
                <td>
                  {val.product.map((val, index) => (
                    <div key={index}>{val.name},</div>
                  ))}
                </td>
                <td>{val.invoiceamount}</td>

                <td>{val.amount}</td>

                <td>{val.balance}</td>
                <td>
                  <DownloadIcon
                   style={{ cursor: 'pointer' }} 
                    onClick={(e) => {
                 
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
