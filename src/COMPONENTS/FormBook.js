import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import "../SYLES/Book.css";
import firebaseApp from '../Firebasse';
import { Book } from '@mui/icons-material';

var data = {
    AuthorName: "",
    BookName: "",
    Category: "", // Default to Empty String
    Price: "",
    Quantity: "0", // Default to "0"
    Version: "",
    PrepareStatus: "Incomplete",
    DTPStatus: "Incomplete",
    PrintStatus: "Incomplete",
    PreparePrice: "",
    DTPPrice: "",
    PrintPrice: ""
};

async function postData() {
    const dbs = firebaseApp.firestore().collection("GENERAL PRODUCTS").doc(data.BookName);
    const add = dbs.set(data);
    add.finally(e => {
        console.log(e);
        window.location = "/";
    });
}

export default function Form1() {
    const [category, setCategory] = useState("Preparing"); // State for Category

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            postData();
        }
    };

    return (
        <div className='form-book' style={{padding: '1%'}}>
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
                />
            </div>
            <div>
                <Button onClick={postData} variant='contained'>SUBMIT DATA</Button>
            </div>
        </div>
    );
}
