import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import "../SYLES/Book.css";
import firebaseApp from '../Firebasse';
import { Book } from '@mui/icons-material';

var data = {
    DistributorName: "",
    Address: "",
    Contact: "",
    Email: ""
};

async function postData() {
    const dbs = firebaseApp.firestore().collection("Distributor").doc(data.DistributorName);
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
            <h1>Add Distributor</h1>
            <div>
                <TextField
                    onChange={e => { data.DistributorName = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="distName"
                    label="Distributor Name"
                    variant="outlined"

                />
            </div>
            <div>
                <TextField
                    onChange={e => { data.Address = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="address"
                    label="Address"
                    variant="outlined"

                    
                />
            </div>
            
            <div>
                <TextField
                    onChange={e => { data.Contact = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="contact"
                    label="Contact"
                    variant="outlined"
                    type='number'
                />
            </div>
            <div>
                <TextField
                    onChange={e => { data.Email = e.target.value; }}
                    onKeyPress={handleEnterKeyPress}
                    fullWidth
                    id="email"
                    label="Email"
                    variant="outlined"
                    type='email'

                />
            </div>
            <div>
                <Button onClick={postData} variant='contained'>SUBMIT DATA</Button>
            </div>
        </div>
    );
}
