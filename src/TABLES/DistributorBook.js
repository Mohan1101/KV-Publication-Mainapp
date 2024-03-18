import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Select, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';

class DistributorBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedSchool !== this.props.selectedSchool) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    try {
      const { selectedSchool } = this.props;
      const productsRef = firebaseApp.firestore().collection('GENERAL PRODUCTS');
      const querySnapshot = await productsRef.where('Distributorname', '==', selectedSchool).get();

      const productsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      this.setState({
        products: productsData,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  render() {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h2>Status Report {this.props.selectedSchool}</h2>
          <Button variant="contained" color="primary" style={{ marginBottom: '1%', float: 'right', marginTop: '1%' }} onClick={this.props.onClose}>
            Close
          </Button>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name of the Book</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount Rate(%)</th>
              <th>Total Price</th>
            <th>Discounted Amount</th>


            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.BookName}</td>
                <td>{product.Quantity}</td>
                <td>{product.Price}</td>
                <td>{product.DiscountRate}</td>
                <td>{Math.round(product.TotalPrice)}</td>
                <td>{product.DiscountAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DistributorBook;
