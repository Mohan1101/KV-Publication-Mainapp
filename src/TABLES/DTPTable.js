import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export class DTPTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryOptions: ["Preparing", "DTP", "Printing", "Inventory"],
            selectedCategory: "",
            completedData: [],
        };
    }

    getData = () => {
        const dbdata = [];
        const completedData = [];

        const get = firebaseApp.firestore().collection('GENERAL PRODUCTS').get();
        get.then(res => {
            res.docs.forEach(e => {
                const book = {
                    NameofTheBook: e.get('BookName'),
                    AuthorName: e.get('AuthorName'),
                    RatePerPage: e.get('RatePerPage'),
                    NoOfPages: e.get('NoOfPages'),
                    DTPPrice: e.get('DTPPrice'),
                    version: e.get('Version'),
                    Category: e.get('Category'),
                    DTPStatus: e.get('DTPStatus'), // Replace with DTPStatus
                    id: e.id
                };

                dbdata.push(book);

                // Check if the book is completed and add it to the completedData array
                if (book.DTPStatus === "Completed") {
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

        // Check if the category is changing from "Preparing" to another category
        if (updatedData[selectedIndex].Category === "DTP") {
            updatedData[selectedIndex].DTPStatus = "Completed";
        }

        updatedData[selectedIndex].Category = event.target.value;

        this.setState({
            data: updatedData
        }, () => {
            // Update the category and DTPStatus in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                Category: event.target.value,
                DTPStatus: updatedData[selectedIndex].DTPStatus
            });
        });
        // Refresh the dtpData after deletion
        this.getData();

    };


 handleRatePerPageChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        const ratePerPage = event.target.value;

        // Assuming "NoOfPages" is a property in your data structure
        const noOfPages = updatedData[selectedIndex].NoOfPages || 0;

        // Calculate Per Piece Work based on your formula
        const dtpprice = ratePerPage * noOfPages;

        updatedData[selectedIndex].RatePerPage = ratePerPage;
        updatedData[selectedIndex].DTPPrice = dtpprice;

        // Update the RatePerPage and dtpprice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            RatePerPage: ratePerPage,
            DTPPrice: dtpprice,
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
        const dtpprice = ratePerPage * noOfPages;

        updatedData[selectedIndex].NoOfPages = noOfPages;
        updatedData[selectedIndex].DTPPrice = dtpprice;

        // Update the NoOfPages and dtpprice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            NoOfPages: noOfPages,
            DTPPrice: dtpprice,
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
        const dtpprice = ratePerPage * noOfPages;

        updatedData[selectedIndex].DTPPrice = dtpprice;

        // Update the dtpprice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            DTPPrice: dtpprice,
            // Add other relevant fields to update in Firestore
        });

        this.setState({
            data: updatedData
        });
    };

    componentDidMount = () => {
        this.getData();
    };

    render() {
        return (
            <div>

                {/* First Table */}
                <table className='styled-table'>
                    <thead>

                        <tr>
                            <th>S.No</th>
                            <th>Name of the Book</th>
                            <th>Author Name</th>
                            <th>Rate per page</th>
                            <th>No. of pages</th>
                            <th>Per.Piece Work</th>
                            <th>Version</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data
                            .filter(val => val.Category === "DTP")
                            .map((val, index) => (
                                <tr key={val.id}>
                                    <td>{index + 1}</td>
                                    <td>{val.NameofTheBook}</td>
                                    <td>{val.AuthorName}</td>
                                    <td>
                                        <TextField
                                            id={`rate-per-page-${val.id}`}
                                            type="number"
                                            value={val.RatePerPage || ""}
                                            onChange={(event) => this.handleRatePerPageChange(event, val.id)}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id={`no-of-pages-${val.id}`}
                                            type="number"
                                            value={val.NoOfPages || ""}
                                            onChange={(event) => this.handleNoOfPagesChange(event, val.id)}
                                        />
                                    </td>
                                    <td>{val.DTPPrice}</td>

                                    <td>{val.version}</td>

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
                                    <td>{val.DTPStatus}</td>
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

                {/* Second Table (Completed Books) */}
                <h2>Status Report</h2>
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name of the Book</th>
                            <th>Author Name</th>
                            <th>Rate per page</th>
                            <th>No. of pages</th>
                            <th>Per.Piece Work</th>
                            <th>Version</th>
                            <th>Status</th>
                            <th>Operstion</th>

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
                                <td>
                                    {val.DTPPrice}
                                </td>
                                <td>{val.version}</td>
                             
                                <td>{val.DTPStatus}</td>
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

export default DTPTable;
