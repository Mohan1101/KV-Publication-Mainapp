import React, { Component, useState } from 'react'
import "../App.css"
import firebaseApp from '../Firebasse';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


export class FormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            status_bg: ""
        }
    }

    getData = () => {
        var dbdata = [];
        const get = firebaseApp.firestore().collection('order-form').get()
        get.then(res => {
            var i = 0;
            res.docs.forEach(e => {
                if (e.get("Status") === "InProgress") {
                    this.setState({
                        status_bg: "active"
                    })
                }
                dbdata.push(
                    {
                        FromAddress: e.get('FromAddress'),
                        ToAddress: e.get('ToAddress'),
                        Products: e.get('Products'),
                        Correspondent: e.get('Correspondent'),
                        Status: e.get('Status'),
                        Price: e.get('Price'),
                        id: e.id
                    }
                )
                this.setState({
                    data: dbdata
                })
            })
        })
    }

    componentDidMount = () => {
        this.getData();
    }
    static propTypes = {}
    render() {
        return (
            <div>
                <table class="styled-table">
                    <tr>
                        <th>From Address</th>
                        <th>To Address</th>
                        <th>Products</th>
                        <th>Correspondent</th>
                        <th>Price</th>
                        <th>Stauts</th>
                        <th>Operation</th>
                    </tr>
                    <tbody>
                        {this.state.data.map((val) => {
                            return (
                                <tr >
                                    <td>{val.FromAddress}</td>
                                    <td>{val.ToAddress}</td>
                                    <td>{val.Products}</td>
                                    <td>{val.Correspondent}</td>
                                    <td>{val.Price}</td>
                                    <td className={val.Status === "InProgress" ? "status_active" : "status"}
                                        onClick={() => {
                                            firebaseApp.firestore().collection("DTP").doc(val.id).update(
                                                { Status: "Completed" }
                                            ).then(res => {
                                                this.getData();
                                            })
                                        }}
                                    >{val.Status}</td>
                                    <td onClick={() => {
                                        firebaseApp.firestore().collection("order-form").doc(val.id).delete()
                                            .then(res => {
                                                this.getData();
                                            })
                                    }}><DeleteIcon className='deleteIcon' /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                
                <Button style={{ marginTop: '2%', float: 'right' }} variant='contained' onClick={e => {
                    window.location = '/addForm'
                }}>Add Work</Button>
            </div>
        )
    }
}

export default FormTable