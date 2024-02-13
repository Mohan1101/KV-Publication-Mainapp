import React from 'react'
import "../SYLES/Book.css"
import { Button, TextField } from '@mui/material'
import firebaseApp from '../Firebasse';

var data = {
    AuthorName: "",
    BookName: "",
    Category: "", //Default to Empty
    Price: "",
    Quantity: "0", // Default to "0"
    Version: "",
};


async function postData() {
    const dbs = firebaseApp.firestore().collection("GENERAL PRODUCTS").doc()
    const add = dbs.set(data);
    add.finally(e => {
        console.log(e);
        window.location = "/"
    })
}



function FormPrinting() {
    return (
        <div>
            <div className='form-book'>
                <h1>PRINTING</h1>
                <div>
                    <TextField onChange={e => {
                        data.BookName = e.target.value
                    }} fullWidth id="book-name" label="Name of the Book" variant="outlined" />
                </div>
                <div>
                    <TextField onChange={e => {
                        data.AuthorName = e.target.value
                    }} fullWidth id="author-name" label="Author Name" variant="outlined" />
                </div>
                <div>
                    <TextField onChange={e => {
                        data.Price = e.target.value
                    }} fullWidth id="per-price-print" label="Per.Price/Print" variant="outlined" />
                </div>
                <div>
                    <TextField onChange={e => {
                        data.Version = e.target.value
                    }} fullWidth id="version" label="Version" variant="outlined" />
                </div>
                <div>
                    <Button onClick={e => {
                        postData()
                    }} variant='contained' label="SUBMIT DATA" >SUBMIT DATA</Button>
                </div>
            </div>
        </div>
    )
}

export default FormPrinting