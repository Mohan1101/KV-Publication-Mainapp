import React from 'react'
import "../SYLES/Book.css"
import { Button, TextField } from '@mui/material'
import firebaseApp from '../Firebasse'

var data = {
    FromAddress: "",
    ToAddress: "",
    Products: "",
    Correspondent: "",
    Status: "InProgress",
    Price: ""
};

async function postData() {
    const dbs = firebaseApp.firestore().collection("order-form").doc()
    const add = dbs.set(data);
    add.finally(e => {
        console.log(e);
        window.location = "/"
    })
}



function FormOrder() {
    return (
        <div className='form-book'>
            <h1>Order Form</h1>
            <div>
                <TextField onChange={e => {
                    data.FromAddress = e.target.value
                }} fullWidth id="FromAddress" label="From Address" variant="outlined" />
            </div>

            <div>
                <TextField onChange={e => {
                    data.ToAddress = e.target.value
                }} fullWidth id="ToAddress" label="To Address" variant="outlined" />
            </div>
            <div>
                <TextField onChange={e => {
                    data.Products = e.target.value
                }} fullWidth id="Products" label="Products" variant="outlined" />
            </div>
            <div>
                <TextField onChange={e => {
                    data.Correspondent = e.target.value
                }} fullWidth id="Correspondent" label="Correspondednt Contact" variant="outlined" />
            </div>
            <div>
                <TextField onChange={e => {
                    data.Price = e.target.value
                }} fullWidth id="Price" label="Price" variant="outlined" />
            </div>
            <div>
                <Button onClick={e => {
                    postData()
                }} variant='contained' label="SUBMIT DATA" >SUBMIT DATA</Button>
            </div>
            * use comma(,) to seperate values
        </div>
    )
}

export default FormOrder