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
            totalamt: 0,
            isQuantityUpdated: false
        };
    }

    getData = async () => {
        try {
            const dbdata = [];
            const res = await firebaseApp.firestore().collection("GENERAL PRODUCTS").get();
    
            res.docs.forEach(e => {
                dbdata.push({
                    NameofTheBook: e.get('BookName'),
                    AuthorName: e.get('AuthorName'),
                    PreparePrice: e.get('PreparePrice'),
                    DTPPrice: e.get('DTPPrice'),
                    PrintPrice: e.get('PrintPrice'),
                    Extracharge: e.get('Extracharge'),
                    MakingCharge: e.get('MakingCharge'),
                    version: e.get('Version'),
                    NoOfPages: e.get('NoOfPages'),
                    Quantity: e.get('Quantity'),
                    Multiples: e.get('Multiples'),
                    SellingPrice: e.get('SellingPrice'),
                    Category: e.get('Category'),
                    isQuantityUpdated: e.get('isQuantityUpdated'),
                    id: e.id
                });
            });
    
            this.setState({
                data: dbdata
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    // calculateTotalPerPieceWork = (id, preparePrice, dtpPrice, printPrice, otherCharges) => {
    //     const total = Number(preparePrice) + Number(dtpPrice) + Number(printPrice) + Number(otherCharges);
        
    //     const selectedIndex = this.state.data.findIndex(item => item.id === id);
    //     const updatedData = [...this.state.data];

     
         
    //     updatedData[selectedIndex].MakingCharge = total / updatedData[selectedIndex].NoOfPages;
      
        
    //     // Update the MakingCharge in Firestore
    //     firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
    //         Quantity: updatedData[selectedIndex].Quantity,
    //         MakingCharge: updatedData[selectedIndex].MakingCharge
    //     });
    
    //     // Update the state with the new data without causing re-renders
    //     this.state.data[selectedIndex] = updatedData[selectedIndex];

     
    
    //     return total;
    // };
    
  
    calculateTotalPerPieceWork (id, preparePrice, dtpPrice, printPrice, otherCharges) {
        const total = Number(preparePrice) + Number(dtpPrice) + Number(printPrice) + Number(otherCharges);

        const selectedIndex = this.state.data.findIndex(item => item.id === id);
        const updatedData = [...this.state.data];

        // Check if Quantity has already been updated
        if (!updatedData[selectedIndex].isQuantityUpdated) {
            updatedData[selectedIndex].MakingCharge = total / updatedData[selectedIndex].NoOfPages;

            // Update the MakingCharge and set isQuantityUpdated to true
            firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
                Quantity: updatedData[selectedIndex].NoOfPages,
                MakingCharge: updatedData[selectedIndex].MakingCharge,
                isQuantityUpdated: true
            });

            this.setState({
                data: updatedData,
                isQuantityUpdated: true
            });
        }

        return total;
    };
    
    


    handleMultiplesChange = (event, id) => {
        const updatedData = [...this.state.data];
        const selectedIndex = updatedData.findIndex(item => item.id === id);
    
    
        const multiples = event.target.value;
    
        // Calculate the new SellingPrice
        const makingCharge = updatedData[selectedIndex].MakingCharge;
        //round off the selling price
        const sellingPrice = Math.round(multiples * makingCharge);
    
        // Update the Multiples and SellingPrice in the state
        updatedData[selectedIndex].Multiples = multiples;
        updatedData[selectedIndex].SellingPrice = sellingPrice;
    
        // Update the state with the new data
        this.setState({
            data: updatedData
        });
    
        // Update the Multiples and SellingPrice in Firestore
        firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(id).update({
           
            Multiples: multiples,
            SellingPrice: sellingPrice
        });
    };
    


    componentDidMount = () => {
        this.getData();
    };

    componentDidUpdate(prevProps, prevState) {
        // Check if data has been updated
        if (this.state.data !== prevState.data) {
            this.getData(); // Fetch data again
        }
    }

    render() {
        return (
            <div>
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name of the Book</th>
                            <th>Author Name</th>
                            <th>Version</th>
                            <th>Per.Piece Work</th>
                            <th>Quantity</th>
                            <th>Making Charge</th>
                            <th>Muliples</th>
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
                                    <td>{val.version}</td>
                                    <td>

                                        {this.calculateTotalPerPieceWork(val.id, val.PreparePrice, val.DTPPrice, val.PrintPrice, val.Extracharge)}

                                    </td>


                                    <td>
                                        {val.Quantity}
                                    </td>
                                    <td>
                                        {val.MakingCharge}
                                    </td>
                                    <td>
                                        <TextField
                                            id={`multiples-input-${val.id}`}
                                            size = 'small'
                                            
                                            value={val.Multiples}
                                            onChange={(event) => this.handleMultiplesChange(event, val.id)}
                                            type='number'
                                        />
                                    </td>
                                    <td>
                                        {val.SellingPrice}
                                    </td>
                                    <td>
                                        <DeleteIcon
                                            className='deleteIcon'
                                            onClick={() => {
                                                firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(val.id).delete()
                                                    .then(() => {
                                                        this.getData();
                                                        console.log("Document successfully deleted!");
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