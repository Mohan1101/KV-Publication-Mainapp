// FormSpecimen.jsx
import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem } from '@mui/material';
import firebaseApp from '../Firebasse';
import DeleteIcon from '@mui/icons-material/Delete';

const FormSpecimen = () => {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [showNewSchoolInput, setShowNewSchoolInput] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');

  useEffect(() => {
    const fetchSchoolOptions = async () => {
      try {
        const snapshot = await firebaseApp.firestore().collection('School').get();
        const schools = snapshot.docs.map(doc => doc.data().name);
        setSchoolOptions(schools);
        console.log("Schools", schools);
      } catch (error) {
        console.error('Error fetching school options:', error);
      }
    };

    fetchSchoolOptions();
  }, []);

  const handleSchoolChange = async (e) => {
    const schoolName = e.target.value;
    setSelectedSchool(schoolName);
    setShowNewSchoolInput(schoolName === 'Add new');

    if (schoolName === 'Add new') {
      // Clear existing fields for manual input
      setSelectedSchool('');
      setPrincipalName('');
      setAddress('');
      setContact('');
      setEmail('');
    } else {
      setSelectedSchool(schoolName);

      // Fetch additional data for the selected school from 'School' collection
      try {
        const snapshot = await firebaseApp.firestore().collection('School').doc(schoolName).get();
        const schoolData = snapshot.data();

        // Update the state with data from the 'School' collection
        if (schoolData) {
          setPrincipalName(schoolData.principalName || '');
          setAddress(schoolData.address || '');
          setContact(schoolData.contact || '');
          setEmail(schoolData.email || '');
        } else {
          // Clear the state if no data is found
          setPrincipalName('');
          setAddress('');
          setContact('');
          setEmail('');
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
      }
    }
    handleEnterKeyPress(e);
  };
  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      postData();
    }
  };
  const postData = async () => {
    try {
      // Check if the selected school is an existing one
      const isExistingSchool = schoolOptions.includes(selectedSchool);
  
      // Add data to the 'Specimen' collection
      await firebaseApp.firestore().collection('Specimen').doc().set({
        sname: selectedSchool,
        principalName: principalName,
        address: address,
        contact: contact,
        email: email,
      });
  
      // Update data in the 'School' collection if it's an existing school
      if (isExistingSchool) {
        const schoolDoc = firebaseApp.firestore().collection('School').doc(selectedSchool);
  
        await schoolDoc.update({
          principalName: principalName,
          address: address,
          contact: contact,
          email: email,
        });
  
        // Fetch updated school options
        const updatedSnapshot = await firebaseApp.firestore().collection('School').get();
        const schools = updatedSnapshot.docs.map(doc => doc.data().name);
        setSchoolOptions(schools);
      } else {
        // Add data to the 'School' collection if it's a new school
        const schoolDoc = firebaseApp.firestore().collection('School').doc(selectedSchool);
  
        await schoolDoc.set({
          name: selectedSchool,
          principalName: principalName,
          address: address,
          contact: contact,
          email: email,
        });
  
        // Fetch updated school options
        const updatedSnapshot = await firebaseApp.firestore().collection('School').get();
        const schools = updatedSnapshot.docs.map(doc => doc.data().name);
        setSchoolOptions(schools);
      }
  
      // Clear the form fields after submission
      setSelectedSchool('');
      setPrincipalName('');
      setAddress('');
      setContact('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  
    window.location = '/';
  };

  const handleDeleteSchool = async (schoolToDelete) => {
    try {
      // Delete the school document from the 'School' collection
      await firebaseApp.firestore().collection('School').doc(schoolToDelete).delete();

      // Fetch updated school options
      const updatedSnapshot = await firebaseApp.firestore().collection('School').get();
      const schools = updatedSnapshot.docs.map(doc => doc.data().name);
      setSchoolOptions(schools);
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };
  


  return (
    <div className='form-book' style={{padding: '1%'}}>
      <h1>Specimen Management</h1>
      <div>
      {showNewSchoolInput ? (
          <TextField
            fullWidth
            id='school-name'
            variant='outlined'
            label='New School Name'
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            onKeyPress={handleEnterKeyPress}
          />
        ) : (
          <TextField
            onChange={handleSchoolChange}
            onKeyPress={handleEnterKeyPress}
            select
            fullWidth
            id='school-name'
            label='School Name'
            variant='outlined'
            value={selectedSchool}
            InputProps={{
              // Allow typing when 'Add new' is selected
              onKeyPress: (e) => {
                if (e.key === 'Enter' && selectedSchool === 'Add new') {
                  e.preventDefault();
                  postData();
                }
              },
            }}
          >
           {schoolOptions.map((school, index) => (
              <MenuItem key={index} value={school} style={{ display: 'flex', justifyItems: 'space-between', paddingTop:'1%', paddingBottom: '1%' }}>
                {school}
                <DeleteIcon
                  variant='contained'
                  size='small'
                  onClick={() => handleDeleteSchool(school)}
                  style={{ marginLeft: '25px' }}
                >
                  Delete
                </DeleteIcon>
              </MenuItem>
            ))}
            <MenuItem value='Add new' style={{ paddingTop:'1%', paddingBottom: '1%' }}
            >Add new</MenuItem>
          </TextField>
        )}

      </div>
      <div>
        <TextField
          onChange={(e) => setPrincipalName(e.target.value)}
          fullWidth
          id='principal-name'
          label='Principal Name'
          variant='outlined'
          value={principalName}
        />
      </div>
      <div>
        <TextField
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          id='address'
          label='Address'
          variant='outlined'
          value={address}
        />
      </div>
      <div>
        <TextField
          onChange={(e) => setContact(e.target.value)}
          fullWidth
          id='contact'
          label='Contact'
          variant='outlined'
          value={contact}
        />
      </div>
      <div>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          id='email'
          label='Email'
          variant='outlined'
          value={email}
          type='email'
        />
      </div>
      <div>
      <Button onClick={postData} variant='contained' label='SUBMIT DATA'>
          SUBMIT DATA
        </Button>
      </div>
    </div>
  );
};

export default FormSpecimen;
