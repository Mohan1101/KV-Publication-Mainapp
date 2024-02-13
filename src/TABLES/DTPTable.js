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

    handlePerPieceWorkChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        updatedData[selectedIndex].DTPPrice = event.target.value;

        this.setState({
            data: updatedData
        }, () => {
            // Update the PerPieceWork in Firestore
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                DTPPrice: event.target.value
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
                                            id={`per-piece-work-input-${val.id}`}
                                            value={val.DTPPrice}
                                            onChange={(event) => this.handlePerPieceWorkChange(event, val.id)}
                                        />
                                    </td>
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
                            <th>Per.Piece Work</th>
                            <th>Version</th>
                            <th>Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.completedData.map((val, index) => (
                            <tr key={val.id}>
                                 <td>{index + 1}</td>
                                <td>{val.NameofTheBook}</td>
                                <td>{val.AuthorName}</td>
                                <td>
                                    {val.DTPPrice}
                                </td>
                                <td>{val.version}</td>
                             
                                <td>{val.DTPStatus}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DTPTable;
