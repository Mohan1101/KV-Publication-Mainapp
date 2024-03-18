import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import "../SYLES/Book.css";
import firebaseApp from '../Firebasse';
import { Book } from '@mui/icons-material';

var data = {
    AuthorName: "",
    BookName: "",
    Category: "", // Default to Empty String
    Price: "0",
    TotalPrice: "0", // Default to "0"
    Quantity: "0", // Default to "0"
    Version: "",
    PrepareStatus: "Incomplete",
    DTPStatus: "Incomplete",
    PrintStatus: "Incomplete",
    PreparePrice: "",
    DiscountRate: "",
    DiscountAmount: "",
    DTPPrice: "",
    PrintPrice: "",
    Distributorname: "NA",
    NoOfPages: "0", // Default to "0",
    Multiples: "0", // Default to "0",
    SellingPrice: "0", // Default to "0",

};




export default function Form1() {
    const [category, setCategory] = useState("Preparing"); // State for Category
    const [distributors, setDistributors] = useState([]);
    const [distributorValue, setDistributorValue] = useState('NA');
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [discountRate, setDiscountRate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountedAmount, setDiscountedAmount] = useState(0);

    async function postData() {
        const dbs = firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(data.BookName);
        const add = dbs.set({
            ...data,
            TotalPrice: totalPrice.toFixed(2), 
            DiscountAmount: parseFloat(discountedAmount.toFixed(2)), // Update discount amount
        });
        console.log(totalPrice.toFixed(2));
        add.finally(e => {
            console.log(e);
            window.location = "/";
        });
    }

    useEffect(() => {
        // Fetch distributor names from Firestore
        const fetchDistributors = async () => {
            try {
                const snapshot = await firebaseApp.firestore().collection("Distributor").get();
                const distributorNames = snapshot.docs.map(doc => doc.data().DistributorName);
                setDistributors(['NA', ...distributorNames]); // Add 'NA' as an option
                console.log(distributorNames);
            } catch (error) {
                console.error('Error fetching distributors:', error);
            }
        };

        fetchDistributors();
    }, []);

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            postData();
        }
    };

    const handleDistributorChange = (event) => {
        const value = event.target.value;
        data.Distributorname = value;
        setDistributorValue(value); // Update the state variable to reflect the selected value
        setShowAdditionalFields(value !== 'NA');
    };

    const handleDiscountChange = (event) => {
        const discount = parseFloat(event.target.value);
        setDiscountRate(discount);
        // Calculate total price and discounted amount
        const price = parseFloat(data.Price);
        const discounted = price * (discount / 100);
        const totalPrice = price - discounted;
        setTotalPrice(totalPrice);
        setDiscountedAmount(discounted);
    };

    return (
        <div className='form-book' style={{ padding: '1%' }}>
            <h1>Book Preparation</h1>
            <div>
                <TextField
                    onChange={e => { data.BookName = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="book-name"
                    label="Name of the Book"
                    variant="outlined"
                />
            </div>
            <div>
                <TextField
                    onChange={e => { data.AuthorName = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="author-name"
                    label="Author Name"
                    variant="outlined"
                />
            </div>

            <div>
                <TextField
                    onChange={e => { data.Version = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="version"
                    label="Version"
                    variant="outlined"
                    type='number'
                />
            </div>
            <div>
                <TextField
                    value={distributorValue}
                    onChange={handleDistributorChange}
                    fullWidth
                    id="distributor"
                    label="Distributor"
                    variant="outlined"
                    select
                >  
                <InputLabel id="demo-simple-select-label">Select Distributor</InputLabel>
                
                    {distributors.map((distributor, index) => (
                        <MenuItem key={index} value={distributor} >
                            {distributor}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            {showAdditionalFields && (
                <>
                    <div>
                        <TextField
                            onChange={e => { data.Price = e.target.value; }}
                            fullWidth
                            id="price"
                            label="Per.piece.work"
                            variant="outlined"
                            type='number'
                        />
                    </div>
                    <div>
                        <TextField
                            onChange={e => { data.Quantity = e.target.value; }}
                            fullWidth
                            id="quantity"
                            label="Quantity"
                            variant="outlined"
                            type='number'
                        />
                    </div>
                    <div>
                        <TextField
                            value={discountRate}
                            onChange={e => {
                                handleDiscountChange(e);
                                data.DiscountRate = e.target.value;
                            }}
                            fullWidth
                            id="discount"
                            label="Discount Rate (%)"
                            variant="outlined"
                            type='number'
                        />

                    </div>
                    <div>
                        <TextField
                            value={discountedAmount.toFixed(2)}
                            onChange={e => { data.DiscountAmount = e.target.value; }}
                            disabled
                            fullWidth
                            id="discounted-amount"
                            label="Discounted Amount"
                            variant="outlined"
                            type='number'
                        />
                    </div>
                    <div>
                        <TextField
                            value={totalPrice.toFixed(2)}
                            onChange={e => { data.Price = e.target.value; }}
                            disabled
                            fullWidth
                            id="total-price"
                            label="Total Price"
                            variant="outlined"
                            type='number'
                        />
                    </div>
                </>
            )}
            <div>
                <Button onClick={postData} variant='contained'>SUBMIT DATA</Button>
            </div>
        </div>
    );
}
