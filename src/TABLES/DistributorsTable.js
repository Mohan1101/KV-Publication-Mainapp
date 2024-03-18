// SMTable.jsx
import React, { useState, useEffect } from 'react';
import firebaseApp from '../Firebasse';
import { Button } from '@mui/material';
import FormSpecimen from '../COMPONENTS/FormSpecimen';
import DeleteIcon from '@mui/icons-material/Delete';
import DistributorBook from './DistributorBook';

const DistributorTable= () => {
    const [data, setData] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const snapshot = await firebaseApp.firestore().collection('Distributor').get();
            const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(newData);
            console.log(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await firebaseApp.firestore().collection('Distributor').doc(id).delete();
            fetchData();  // Refresh the data after deletion
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleSchoolSelect = (school) => {
        setSelectedSchool(school);
    };


   const  handleSchoolClose = () => {
        setSelectedSchool(null);
    }

    return (
        <div>
             <Button style={{ marginBottom: '1%',marginTop:'-1%', float: 'right' }} variant='contained' onClick={e => {
                window.location = '/addDistributor'
            }}>Add Distributor</Button>
            <table className='styled-table'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Distibutor Name</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} onClick={() => handleSchoolSelect(item.DistributorName)} style={{ cursor: 'pointer' }}>
                            <td>{index + 1}</td>
                            <td>
                                {/* Remove the underline and handle click on the entire row */}
                                <span style={{ textDecoration: 'none' }}>
                                    {item.DistributorName}
                                </span>
                            </td>
                            <td>{item.Address}</td>
                            <td>{item.Contact}</td>
                            <td>{item.Email}</td>
                            <td>
                                <DeleteIcon
                                    className='deleteIcon'
                                    onClick={() => handleDelete(item.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

           
            
           

             {/* Render the SpecimenBook component with the selected school */}
             {selectedSchool && <DistributorBook selectedSchool={selectedSchool} onClose={handleSchoolClose} />}
        </div>
    );
};

export default DistributorTable
