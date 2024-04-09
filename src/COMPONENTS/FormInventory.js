import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import "../SYLES/Book.css";
import firebaseApp from '../Firebasse';
import { Book } from '@mui/icons-material';

var data = {
    AuthorName: "",
    BookName: "",
    Category: "Inventory", // Default to Inventory
    Price: "0",
    Quantity: "", 
    Version: "",
    PrepareStatus: "Incomplete",
    DTPStatus: "Incomplete",
    PrintStatus: "Incomplete",
    PreparePrice: "0", // Default to "0"
    DTPPrice: "0",
    PrintPrice: "0",
    Distributorname: "NA",
    NoOfPages: "0", // Default to "0",
    Multiples: "0", // Default to "0",
    MakingCharge: "0", // Default to "0",
    Extracharge: "0", // Default to "0",
    SellingPrice: "0", // Default to "0",
    RatePerPage: "0", // Default to "0",

};




export default function Form1() {



    

    async function postData() {
        const dbs = firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(data.BookName)
        const add = dbs.set(data);
        add.finally(e => {
            console.log(e);
            window.location = "/";
        });

    }


    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            postData();
        }
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
                    onChange={e => { data.SellingPrice = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="Price"
                    label="Price"
                    variant="outlined"
                    type='number'
                />
            </div>
            <div>
                <TextField
                    onChange={e => { data.Quantity = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="Quantity"
                    label="Quantity"
                    variant="outlined"
                    type='number'
                />
            </div>
            
            <div>
                <Button onClick={postData} variant='contained'>SUBMIT DATA</Button>
            </div>
        </div>
    );
}
