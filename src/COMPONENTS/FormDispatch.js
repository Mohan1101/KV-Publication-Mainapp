import React from 'react'
import "../SYLES/Book.css"
import { Button, TextField } from '@mui/material'


function FormDispatch() {
    return (
        <div className='form-book'>
            <h1>Dispatch Form</h1>
            <div>
                <TextField fullWidth id="book-name" label="Name of the Book" variant="outlined" />
            </div>
            <div>
                <TextField fullWidth id="author-name" label="Author Name" variant="outlined" />
            </div>
            <div>
                <TextField fullWidth id="per-price-print" label="Per.Price/Print" variant="outlined" />
            </div>
            <div>
                <TextField fullWidth id="version" label="Version" variant="outlined" />
            </div>
            <div>
                <Button variant='contained' label="SUBMIT DATA" >SUBMIT DATA</Button>
            </div>
        </div>
    )
}

export default FormDispatch