// SpecimenBook.jsx
import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';

class SpecimenBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specimenData: [],
      showForm: false,
      newWorkDate: null,
      newBookName: '',
      newNoOfCopies: '', // New state for the number of copies
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
      newBookName: '',
      newNoOfCopies: '', // Reset the number of copies when closing the form
    });
  };



// Function to add a new item (book) to the form and upload to Firestore
handleAddItem = async () => {
  const { selectedSchool } = this.props;
  const { newWorkDate, newBookName, newNoOfCopies } = this.state;

  try {
    // Check if newWorkDate is not null before splitting
    const formattedDate = newWorkDate ? newWorkDate.split('-').reverse().join('/') : '';

    // Check if newBookName and newNoOfCopies are arrays
    if (Array.isArray(newBookName) && Array.isArray(newNoOfCopies)) {
      // Assuming both arrays have the same length
      const booksToAdd = newBookName.map((book, index) => ({
        Date: formattedDate,
        BookName: book,
        NoOfCopies: newNoOfCopies[index],
      }));

      // Batch write to add multiple books at once
      const batch = firebaseApp.firestore().batch();
      const collectionRef = firebaseApp.firestore().collection('Specimen').doc(selectedSchool).collection(selectedSchool);

      booksToAdd.forEach((book) => {
        const docRef = collectionRef.doc(); // Automatically generate a unique ID
        batch.set(docRef, book);
      });

      await batch.commit();
    } else {
      // Add a single document if not arrays
      await firebaseApp.firestore().collection('Specimen').doc(selectedSchool).collection(selectedSchool).add({
        Date: formattedDate,
        BookName: newBookName,
        NoOfCopies: newNoOfCopies,
      });
    }

    this.updateSpecimenData(selectedSchool);
    // Clear the form fields after uploading to Firestore
    this.setState({
      newWorkDate: null,
      newBookName: '',
      newNoOfCopies: '',
    });
  } catch (error) {
    console.error('Error adding book data:', error);
  }
};




  // Function to handle deleting a book entry
  handleDeleteBook = async (bookId) => {
    const { selectedSchool } = this.props;

    try {
      // Delete the document from the collection
      await firebaseApp.firestore().collection('Specimen').doc(selectedSchool).collection(selectedSchool).doc(bookId).delete();

      // Refresh the specimenData after deletion
      this.updateSpecimenData(selectedSchool);
    } catch (error) {
      console.error('Error deleting book data:', error);
    }
  };
  getProductData = async () => {
    try {
      const snapshot = await firebaseApp.firestore().collection('GENERAL PRODUCTS').where('Category', '==', 'Inventory').get();
      const inventoryProducts = snapshot.docs.map((doc) => doc.get('BookName'));
      this.setState({
        inventoryProducts,
      });
    } catch (error) {
      console.error('Error getting inventoryProducts:', error);
    }
  };
  

  // Function to fetch specimenData from Firebase
  getSpecimenData = async (selectedSchool) => {
    try {
      const snapshot = await firebaseApp
        .firestore()
        .collection('Specimen')
        .doc(selectedSchool)
        .collection(selectedSchool)
        .orderBy('Date', 'desc')  // Order by Date in descending order
        .get();

      const specimenData = snapshot.docs.map((doc) => ({
        date: doc.get('Date'),
        bookName: doc.get('BookName'),
        noOfCopies: doc.get('NoOfCopies'), // Get the number of copies
        id: doc.id,
      }));

      // Update the state with the specimenData
      this.setState({
        specimenData,
      });
    } catch (error) {
      console.error('Error getting specimenData:', error);
    }
  };

  // Function to update specimenData with the selected school
  updateSpecimenData = (selectedSchool) => {
    this.getSpecimenData(selectedSchool);
  };

  // Fetch specimenData when the component mounts
  componentDidMount() {
    const { selectedSchool } = this.props;
    this.getProductData();
    this.getSpecimenData(selectedSchool);

  }

  // Fetch specimenData when the selected school changes
  componentDidUpdate(prevProps) {
    const { selectedSchool } = this.props;
    if (selectedSchool !== prevProps.selectedSchool) {
      this.getSpecimenData(selectedSchool);
    }
  }

  render() {
    const { specimenData, inventoryProducts } = this.state; 

    return (
      <div>
        <h2>Specimen Books for {this.props.selectedSchool}</h2>
        <Button
          style={{ marginBottom: '1%', float: 'right'}}
          variant="contained"
          onClick={this.handleOpenForm}
        >
          Add Book
        </Button>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name of the Book</th>
              <th>No of Copies</th> {/* New column for No of Copies */}
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {specimenData.map((book) => (
              <tr key={book.id}>
                <td>{book.date}</td>
                <td>{book.bookName}</td>
                <td>{book.noOfCopies}</td> {/* Display the number of copies */}
                <td>
                  <DeleteIcon
                    className='deleteIcon'
                    onClick={() => this.handleDeleteBook(book.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Work button to open the form */}
       

        {/* Add Book form */}
        {this.state.showForm && (
          <div>
            <h3>Add Book</h3>

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
  label="Name of the Book"
  variant="outlined"
  select
  value={this.state.newBookName}
  onChange={(e) => this.setState({ newBookName: e.target.value })}
  style={{ marginLeft: '10px', width: '250px' }}
>

              {inventoryProducts.map((productName, index) => (
                <MenuItem key={index} value={productName}>
                  {productName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="No of Copies"
              variant="outlined"
              type="number"
              value={this.state.newNoOfCopies}
              onChange={(e) => this.setState({ newNoOfCopies: e.target.value })}
              style={{ marginLeft: '10px' }}
            />
              <Button
              variant="contained"
              style={{ marginLeft: '10px' }}
              onClick={this.handleAddItem}
            >
              Add Item
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

export default SpecimenBook;
