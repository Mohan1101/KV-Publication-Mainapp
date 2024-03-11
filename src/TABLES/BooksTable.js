import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export class BooksTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryOptions: ["DTP", "Printing", "Inventory"],
            selectedCategory: "",
            completedData: [],
        };
    }

    getData = () => {
        const dbdata = [];
        const completedData = [];

        // Fetch all books
        const getAllBooks = firebaseApp.firestore().collection('GENERAL PRODUCTS').get();
        getAllBooks.then(res => {
            res.docs.forEach(e => {
                const book = {
                    NameofTheBook: e.get('BookName'),
                    AuthorName: e.get('AuthorName'),
                    RatePerPage: e.get('RatePerPage'),
                    NoOfPages: e.get('NoOfPages'),
                    PreparePrice: e.get('PreparePrice'),
                    version: e.get('Version'),
                    Category: e.get('Category'),
                    PrepareStatus: e.get('PrepareStatus'),
                    id: e.id
                };

                dbdata.push(book);

                // Check if the book is completed and add it to the completedData array
                if (book.PrepareStatus === "Completed") {
                    completedData.push(book);
                }
            });

            this.setState({
                data: dbdata,
                completedData: completedData
            });
        });
    };


    handleCategoryChange = (event, id) => {
    const updatedData = [...this.state.data];
    const selectedIndex = updatedData.findIndex(item => item.id === id);

    // Check if "Rate per page" and "No. of pages" are filled before allowing category selection
    if (
        updatedData[selectedIndex].RatePerPage === undefined ||
        updatedData[selectedIndex].NoOfPages === undefined ||
        updatedData[selectedIndex].RatePerPage === "" ||
        updatedData[selectedIndex].NoOfPages === ""
    ) {
        alert("Please fill Rate per page and No. of pages before selecting a category");
        return;
    }

    // check if the category is changed from nothing to something else
    if (updatedData[selectedIndex].Category === "") {
        updatedData[selectedIndex].PrepareStatus = "Completed";
    }

    updatedData[selectedIndex].Category = event.target.value;

    this.setState(
        {
            data: updatedData,
        },
        () => {
            // Update the category and PrepareStatus in Firestore
            firebaseApp
                .firestore()
                .collection("GENERAL PRODUCTS")
                .doc(id)
                .update({
                    Category: event.target.value,
                    PrepareStatus: updatedData[selectedIndex].PrepareStatus,
                });
        }
    );
    this.getData();
};


    handleBookNameChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        updatedData[selectedIndex].NameofTheBook = event.target.value;

        this.setState({
            data: updatedData
        }, () => {
            // Update the NameofTheBook in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                BookName: event.target.value
            });
        });
    };

    handleRatePerPageChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        const ratePerPage = event.target.value;

        // Assuming "NoOfPages" is a property in your data structure
        const noOfPages = updatedData[selectedIndex].NoOfPages || 0;

        // Calculate Per Piece Work based on your formula
        const perPieceWork = ratePerPage * noOfPages;

        updatedData[selectedIndex].RatePerPage = ratePerPage;
        updatedData[selectedIndex].PreparePrice = perPieceWork;

        // Update the RatePerPage and PerPieceWork in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            RatePerPage: ratePerPage,
            PreparePrice: perPieceWork,
            // Add other relevant fields to update in Firestore
        });

        this.setState({
            data: updatedData
        });
    };

    handleNoOfPagesChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        const noOfPages = event.target.value;

        // Assuming "RatePerPage" is a property in your data structure
        const ratePerPage = updatedData[selectedIndex].RatePerPage || 0;

        // Calculate Per Piece Work based on your formula
        const perPieceWork = ratePerPage * noOfPages;

        updatedData[selectedIndex].NoOfPages = noOfPages;
        updatedData[selectedIndex].PreparePrice = perPieceWork;

        // Update the NoOfPages and PerPieceWork in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            NoOfPages: noOfPages,
            PreparePrice: perPieceWork,
            // Add other relevant fields to update in Firestore
        });

        this.setState({
            data: updatedData
        });
    };

    handlePerPieceWorkChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);

        // Assuming "RatePerPage" and "NoOfPages" are properties in your data structure
        const ratePerPage = updatedData[selectedIndex].RatePerPage || 0;
        const noOfPages = updatedData[selectedIndex].NoOfPages || 0;

        // Calculate Per Piece Work based on your formula
        const perPieceWork = ratePerPage * noOfPages;

        updatedData[selectedIndex].PreparePrice = perPieceWork;

        // Update the PerPieceWork in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            PreparePrice: perPieceWork,
            // Add other relevant fields to update in Firestore
        });

        this.setState({
            data: updatedData
        });
    };

    handleAuthorNameChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        updatedData[selectedIndex].AuthorName = event.target.value;

        this.setState({
            data: updatedData
        }, () => {
            // Update the AuthorName in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                AuthorName: event.target.value
            });
        });
    };

    handleVersionChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        updatedData[selectedIndex].version = event.target.value;

        this.setState({
            data: updatedData
        }, () => {
            // Update the Version in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                Version: event.target.value
            });
        });
    };

    componentDidMount = () => {
        this.getData();
    };

    render() {
        return (
            <div>
                 <Button style={{ marginBottom: '1%', marginTop:'-1%', float: 'right' }} variant='contained' onClick={e => {
                    window.location = '/PerpareBook'
                }}>Add Work</Button>
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name of the Book</th>
                            <th>Author Name</th>
                            <th>Rate per page</th>
                            <th>No. of pages</th>
                            <th>Per piece work</th>

                            <th>Version</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data
                            .filter(val => val.Category === "Preparing" || val.Category === "")
                            .map((val, index) => (
                                <tr key={val.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <TextField
                                            id={`book-name-input-${val.id}`}
                                            multiline
                                            maxRows={4}
                                            size = 'small'
                                            value={val.NameofTheBook}
                                            onChange={(event) => this.handleBookNameChange(event, val.id)}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id={`author-name-input-${val.id}`}
                                            value={val.AuthorName}
                                            size = 'small'
                                            onChange={(event) => this.handleAuthorNameChange(event, val.id)}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id={`rate-per-page-input-${val.id}`}
                                            value={val.RatePerPage || ""}
                                            type= 'number'
                                            size = 'small'
                                            onChange={(event) => this.handleRatePerPageChange(event, val.id)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id={`no-of-pages-input-${val.id}`}
                                            value={val.NoOfPages || ""}
                                            type= 'number'
                                            size = 'small'
                                            onChange={(event) => this.handleNoOfPagesChange(event, val.id)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        {
                                            val.PreparePrice
                                        }
                                    </td>
                                    <td>
                                        <TextField
                                            id={`version-input-${val.id}`}
                                            value={val.version}
                                            type = 'number'
                                            size = 'small'
                                            onChange={(event) => this.handleVersionChange(event, val.id)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl>
                                            <InputLabel id={`category-label-${val.id}`} style={{ display: 'none' }}>Category</InputLabel>
                                            <Select
                                                labelId={`category-label-${val.id}`}
                                                id={`category-select-${val.id}`}
                                                value={val.Category || ""}
                                                onChange={(event) => this.handleCategoryChange(event, val.id)}
                                                displayEmpty
                                            >
                                                {this.state.categoryOptions.map((category, index) => (
                                                    <MenuItem key={index} value={category}>{category}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </td>
                                    <td>{val.PrepareStatus}</td>
                                    <td>
                                        <DeleteIcon
                                            className='deleteIcon'
                                            onClick={() => {
                                                firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(val.id).delete()
                                                    .then(() => {
                                                        this.getData();
                                                    })
                                                    .catch(error => {
                                                        console.error("Error deleting document: ", error);
                                                    });
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
               
                <h2>Status Report</h2>
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name of the Book</th>
                            <th>Author Name</th>
                            <th>Rate per page</th>
                            <th>No. of pages</th>
                            <th>Per piece work</th>
                            <th>Version</th>
                            <th>Status</th>
                            <th>Operation</th>

                        </tr>
                    </thead>
                    <tbody>
                    {this.state.completedData.map((val, index) => (
                            <tr key={val.id}>
                                <td>{index + 1}</td>
                                <td>{val.NameofTheBook}</td>
                                <td>{val.AuthorName}</td>
                                <td>{val.RatePerPage}</td>
                                <td>{val.NoOfPages}</td>
                                <td>{val.PreparePrice}</td>
                                <td>{val.version}</td>
                                <td>{val.PrepareStatus}</td>
                                <td>
                                    <DeleteIcon
                                        className='deleteIcon'
                                        onClick={() => {
                                            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(val.id).delete()
                                                .then(() => {
                                                    this.getData();
                                                })
                                                .catch(error => {
                                                    console.error("Error deleting document: ", error);
                                                });
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        )
    }
}

export default BooksTable;
