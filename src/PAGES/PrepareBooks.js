import React from 'react'
import BooksTable from '../TABLES/BooksTable'
import { Button } from '@mui/material'
import Form1 from '../COMPONENTS/FormBook'
import "../index.css"

function PrepareBooks() {
    return (
        <div className='books-container'>
            <BooksTable /><br />
        </div>
    )
}

export default PrepareBooks