import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export class PrintingTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryOptions: ["Preparing",  "DTP", "Printing", "Inventory"],
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
                    PrintPrice: e.get('PrintPrice'),
                    version: e.get('Version'),
                    NoOfPages: e.get('NoOfPages'),
                    RatePerPage: e.get('RatePerPage'),
                    Extracharge: e.get('Extracharge'),
                    MakingCharge: e.get('MakingCharge'),
                    Category: e.get('Category'),
                    PrintStatus: e.get('PrintStatus'), // Replace with PrintStatus
                    id: e.id
                };

                dbdata.push(book);

                // Check if the book is completed and add it to the completedData array
                if (book.PrintStatus === "Completed") {
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
            updatedData[selectedIndex].Extracharge === undefined ||
            updatedData[selectedIndex].RatePerPage === "" ||
            updatedData[selectedIndex].NoOfPages === "" ||
            updatedData[selectedIndex].Extracharge === ""
        ) {
            alert("Please fill Rate per page and No. of pages before selecting a category");
            return;
        }

        // Check if the category is changing from "Preparing" to another category
        if (updatedData[selectedIndex].Category === "Printing") {
            updatedData[selectedIndex].PrintStatus = "Completed";
        }

        updatedData[selectedIndex].Category = event.target.value;

        this.setState({
            data: updatedData
        }, () => { 
            // Update the category and PrintStatus in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                Category: event.target.value,
                PrintStatus: updatedData[selectedIndex].PrintStatus
            });
        });
        // Refresh the printingData after deletion
        this.getData();
    };

    
    handleRatePerPageChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        const ratePerPage = event.target.value;

        // Assuming "NoOfPages" is a property in your data structure
        const noOfPages = updatedData[selectedIndex].NoOfPages || 0;

        // Calculate Per Piece Work based on your formula
        const printprice = ratePerPage * noOfPages;

        updatedData[selectedIndex].RatePerPage = ratePerPage;
        updatedData[selectedIndex].PrintPrice = printprice;

        // Update the RatePerPage and printprice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            RatePerPage: ratePerPage,
            PrintPrice: printprice,
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
        const printprice = ratePerPage * noOfPages;

        updatedData[selectedIndex].NoOfPages = noOfPages;
        updatedData[selectedIndex].PrintPrice = printprice;

        // Update the NoOfPages and printprice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            NoOfPages: noOfPages,
            PrintPrice: printprice,
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
        const printprice = ratePerPage * noOfPages;

        updatedData[selectedIndex].PrintPrice = printprice;

        // Update the printprice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            PrintPrice: printprice,
            // Add other relevant fields to update in Firestore
        });

        this.setState({
            data: updatedData
        });
    };

    handleMakingChargeChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        updatedData[selectedIndex].Extracharge = event.target.value;

        this.setState({
            data: updatedData
        }, () => {
            // Update the MakingCharge in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                Extracharge: event.target.value
            });
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
                            <th>Rate Per Book</th>
                            <th>No of Books</th>
                            <th>Per.Piece Work</th>
                            <th>Version</th>
                            <th>Other Charges</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data
                            .filter(val => val.Category === "Printing")
                            .map((val, index) => (
            
                                <tr key={val.id}>
                                    <td>{index + 1}</td>
                                    <td>{val.NameofTheBook}</td>
                                    <td>{val.AuthorName}</td>
                                    <td>
                                        <TextField
                                            id={`rate-per-page-input-${val.id}`}
                                            value={val.RatePerPage || ""}
                                            onChange={(event) => this.handleRatePerPageChange(event, val.id)}
                                            type='number'
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id={`no-of-pages-input-${val.id}`}
                                            type='number'
                                            value={val.NoOfPages || ""}
                                            onChange={(event) => this.handleNoOfPagesChange(event, val.id)}

                                        />
                                    </td>
                                        
                                    <td>
                                        {val.PrintPrice}
                                    </td>

                                    <td>{val.version}</td>
                                    <td>
                                        <TextField
                                            type='number'
                                            id={`making-charge-input-${val.id}`}
                                            value={val.Extracharge || ""}
                                            onChange={(event) => this.handleMakingChargeChange(event, val.id)}
                                            required
                                           
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
                                    <td>{val.PrintStatus}</td>
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
                            <th>Rate Per Book</th>
                            <th>No of Books</th>
                            <th>Per.Piece Work</th>
                            <th>Version</th>
                            <th>Other Charges</th>
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
                                <td>
                                   {val.PrintPrice}
                                </td>
                                <td>{val.version}</td>
                                <td>
                                    {val.Extracharge}
                                </td>
                               
                                <td>{val.PrintStatus}</td>
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
        );
    }
}

export default PrintingTable;
