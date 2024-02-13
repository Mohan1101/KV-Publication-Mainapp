import React, { Component } from 'react';
import "../App.css"
import firebaseApp from '../Firebasse';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export class InventoryTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    getData = () => {
        const dbdata = [];
        const get = firebaseApp.firestore().collection('GENERAL PRODUCTS').get();
        get.then(res => {
            res.docs.forEach(e => {
                dbdata.push({
                    NameofTheBook: e.get('BookName'),
                    AuthorName: e.get('AuthorName'),
                    PreparePrice: e.get('PreparePrice'),
                    DTPPrice: e.get('DTPPrice'),
                    PrintPrice: e.get('PrintPrice'),
                    MakingCharge: e.get('MakingCharge'),
                    version: e.get('Version'),
                    Quantity: e.get('Quantity'),
                    SellingPrice: e.get('SellingPrice'),
                    Category: e.get('Category'),
                    id: e.id
                });

            });
            this.setState({
                data: dbdata
            });
        });
    };

    calculateTotalPerPieceWork = (preparePrice, dtpPrice, printPrice, makingCharge) => {
        // Calculate the sum of PreparePrice, DTPPrice, and PrintPrice by converting the srring to number
        const total = Number(preparePrice) + Number(dtpPrice) + Number(printPrice) + Number(makingCharge);
        return total;
    };

    handleQuantityChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
        updatedData[selectedIndex].Quantity = event.target.value;

        // Update the Quantity in Firestore
        this.setState({
            data: updatedData
        }, () => {

                firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                Quantity: event.target.value
            });
        }); // After successful update, update the state
    
};



handleSellingPriceChange = (event, id) => {
    const updatedData = [...this.state.data];
    const selectedIndex = updatedData.findIndex(item => item.id === id);
    updatedData[selectedIndex].SellingPrice = event.target.value;

    this.setState({
        data: updatedData
    }, () => {
        // Update the PerPieceWork in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
            SellingPrice: event.target.value
        });
    });
};

componentDidMount = () => {
    this.getData();
};

render() {
    return (
        <div>
            <table className='styled-table'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name of the Book</th>
                        <th>Author Name</th>
                        <th>Per.Piece Work</th>
                        <th>Version</th>
                        <th>Quantity</th>
                        <th>Selling Price</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data
                        .filter(val => val.Category === "Inventory")
                        .map((val, index) => (
                            <tr key={val.id}>
                                <td>{index + 1}</td>
                                <td>{val.NameofTheBook}</td>
                                <td>{val.AuthorName}</td>
                                <td>

                                    {this.calculateTotalPerPieceWork(val.PreparePrice, val.DTPPrice, val.PrintPrice, val.MakingCharge)}

                                </td>
                                <td>{val.version}</td>

                                <td>
                                    <TextField
                                        id={`quantity-input-${val.id}`}
                                        value={val.Quantity}
                                        onChange={(event) => this.handleQuantityChange(event, val.id)}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id={`selling-price-input-${val.id}`}
                                        value={val.SellingPrice}
                                        onChange={(event) => this.handleSellingPriceChange(event, val.id)}
                                    />
                                </td>
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

export default InventoryTable;