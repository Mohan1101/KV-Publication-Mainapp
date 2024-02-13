import React, { Component } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import firebaseApp from '../Firebasse';
import OrderBook from './OrderBook'; // Import the OrderBook component
import DownloadIcon from '@mui/icons-material/Download';

class OrderTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedSchool: null,
        };
    }

    getData = () => {
        var dbdata = [];
        const get = firebaseApp.firestore().collection('Orders').get();
        get.then((res) => {
            var i = 0;
            res.docs.forEach((e) => {
                dbdata.push({
                    Date: e.get('Date'),
                    SchoolName: e.get('SchoolName'),
                    Principal: e.get('Principal'),
                    Contact: e.get('Contact'),
                    Email: e.get('Email'),
                    DownloadLink: e.get('Downloadablelink'),
                    id: e.id,
                });
            });
    
            this.setState({
                data: dbdata,
            }, () => {
                console.log(this.state.data);
            });
        });
    };
    

    handleOrderBookOpen = (orderId) => {
        this.setState({ selectedSchool: orderId });
    };
    

    handleOrderBookClose = () => {
        this.setState({ selectedSchool: null });
    };

    componentDidMount = () => {
        this.getData();
        
    };

    render() {
        return (
            <div>
                <Button
                    style={{ marginBottom: '1%', float: 'right' }}
                    variant="contained"
                    onClick={(e) => {
                        window.location.href = 'https://kvpublication-invoicegenerator.web.app/orderform';
                    }}
                >
                    Add Order
                </Button>

                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Date</th>
                            <th>School Name</th>
                            <th>Principal Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Download Invoice</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((val, index) => {
                            return (
                                <tr
                                    key={index}
                                    onClick={() => this.handleOrderBookOpen(val.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{val.Date}</td>
                                    <td>{val.SchoolName}</td>
                                    <td>{val.Principal}</td>
                                    <td>{val.Contact}</td>
                                    <td>{val.Email}</td>
                                    <td>
                                        <DownloadIcon
                                            onClick={(e) => {
                                                val.DownloadLink ? window.open(val.DownloadLink) : alert("No Invoice Found")

                                            }}
                                        />
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>



                {this.state.selectedSchool && (
                    <OrderBook orderId={this.state.selectedSchool} onClose={this.handleOrderBookClose} />
                )}
            </div>
        );
    }
}

export default OrderTable;
