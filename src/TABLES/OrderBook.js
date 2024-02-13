import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Select, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';

class OrderBook extends Component {
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
    if (prevProps.orderId !== this.props.orderId) {
      this.fetchData();
    }
  }
  
  fetchData = async () => {
    try {
      const { orderId } = this.props;
      const productsSubcollectionRef = firebaseApp
        .firestore()
        .collection('Orders')
        .doc(orderId)
        .collection('Products');
  
      const productsSnapshot = await productsSubcollectionRef.get();
      const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      this.setState({
        products: productsData,
      });
      
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  handlePendingStatusChange = async (productId, newPendingStatus) => {
    try {
      const { orderId } = this.props;  // Use orderId instead of schoolName
      const productsSubcollectionRef = firebaseApp
        .firestore()
        .collection('Orders')
        .doc(orderId)
        .collection('Products');
  
      const productDoc = await productsSubcollectionRef.doc(productId).get();
  
      if (productDoc.exists) {
        await productsSubcollectionRef.doc(productId).update({ PendingStatus: newPendingStatus });
  
        // Update the state immediately after updating in Firestore
        this.setState((prevState) => {
          const updatedProducts = prevState.products.map((product) => {
            if (product.id === productId) {
              return { ...product, PendingStatus: newPendingStatus };
            }
            return product;
          });
  
          return {
            products: updatedProducts,
          };
        });
  
        // Log updated products data
        const updatedProductsSnapshot = await productsSubcollectionRef.get();
        const updatedProductsData = updatedProductsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Updated Products Data:', updatedProductsData);
      } else {
        console.error('Product document not found. ProductID:', productId);
      }
    } catch (error) {
      console.error('Error updating pending status:', error);
    }
  };

  render() {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h2>Status Report {this.props.schoolName}</h2>
          <Button variant="contained" onClick={this.props.onClose}>
            Close
          </Button>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Books</th>
              <th>Dispatched</th>
              <th>Pending</th>
              <th>Pending Status</th>
            </tr>
          </thead>
          <tbody>
          {this.state.products.map((product, index) => (
              <tr key={index}>
                <td>{product.Date}</td>
                <td>{product.Product}</td>
                <td>{product.Quantity}</td>
                <td>{product.PendingQuantity}</td>
                <td>
                  {product.PendingQuantity === 0 ? (
                    'Completed'
                  ) : (
                    <Select
                      value={product.PendingStatus || ''}  // Ensure value is not undefined
                      onChange={(e) => this.handlePendingStatusChange(product.id, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Status</MenuItem>
                      <MenuItem value="Incomplete">Incomplete</MenuItem>
                      <MenuItem value="Complete">Complete</MenuItem>
                    </Select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderBook;