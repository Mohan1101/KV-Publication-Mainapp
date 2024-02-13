// SMTable.jsx
import React, { useState, useEffect } from 'react';
import firebaseApp from '../Firebasse';
import { Button } from '@mui/material';
import FormSpecimen from '../COMPONENTS/FormSpecimen';
import DeleteIcon from '@mui/icons-material/Delete';
import SpecimenBook from './SpecimenBook';

const SMTable = () => {
    const [data, setData] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const snapshot = await firebaseApp.firestore().collection('Specimen').get();
            const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(newData);
            console.log(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await firebaseApp.firestore().collection('Specimen').doc(id).delete();
            fetchData();  // Refresh the data after deletion
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleSchoolSelect = (school) => {
        setSelectedSchool(school);
    };

    return (
        <div>
             <Button style={{ marginBottom: '1%', float: 'right' }} variant='contained' onClick={e => {
                window.location = '/addSpecimen'
            }}>Add School</Button>
            <table className='styled-table'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>School Name</th>
                        <th>Principal Name</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} onClick={() => handleSchoolSelect(item.sname)} style={{ cursor: 'pointer' }}>
                            <td>{index + 1}</td>
                            <td>
                                {/* Remove the underline and handle click on the entire row */}
                                <span style={{ textDecoration: 'none' }}>
                                    {item.sname}
                                </span>
                            </td>
                            <td>{item.principalName}</td>
                            <td>{item.address}</td>
                            <td>{item.contact}</td>
                            <td>{item.email}</td>
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
             {selectedSchool && <SpecimenBook selectedSchool={selectedSchool} />}
        </div>
    );
};

export default SMTable;
